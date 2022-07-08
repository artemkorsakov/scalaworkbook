---
layout: docsplus
title: "Quoted Code"
section: scala
prev: metaprogramming/macros
next: metaprogramming/runtime-staging
---

## {{page.title}}

### Кодовые блоки

Блок кода в кавычках `'{ ... }` синтаксически похож на строковую кавычку `" ... "` 
с той разницей, что первая содержит типизированный код. 
Чтобы вставить код в другой код, можно использовать синтаксис `$expr` или `${ expr }`, 
где `expr` имеет тип `Expr[T]`.
Интуитивно понятно, что код непосредственно внутри кавычки (`'{ ... }`) сейчас не выполняется, 
в то время как код внутри склейки (`${ ... }`) оценивается и результаты встраиваются в окружающее выражение.

```scala
val msg = Expr("Hello")
val printHello = '{ print($msg) }
println(printHello.show) // print("Hello")
```

Как правило, цитаты задерживают выполнение, в то время как склейка делает это раньше окружающего кода.
Из-за некоторых технических соображений непосредственно внутри `inline` определений, 
которые называются [макросами](@DOC@metaprogramming/macros), 
разрешены только склейки верхнего уровня.

Можно написать цитату внутри цитаты, но этот шаблон не распространен при написании макросов.

### Согласованность уровней

Нельзя просто написать любой произвольный код в цитатах и в склейках, 
так как одна часть программы будет жить во время компиляции, а другая — во время выполнения. 
Рассмотрим следующий плохо сконструированный код:

```scala
def myBadCounter1(using Quotes): Expr[Int] = {
  var x = 0
  '{ x += 1; x }
}
```

Проблема с этим кодом в том, что `x` существует во время компиляции, 
но затем мы пытаемся использовать его после завершения компиляции (возможно, даже на другой машине). 
Ясно, что невозможно получить доступ к его значению и обновить `x`.

Теперь рассмотрим двойную версию, где определяется переменная во время выполнения 
и происходит попытка получить к ней доступ во время компиляции:

```scala
def myBadCounter2(using Quotes): Expr[Int] = '{
  var x = 0
  ${ x += 1; 'x }
}
```

Ясно, что это не должно работать, так как переменная еще не существует.

Чтобы убедиться, что нельзя писать программы, которые содержат такого рода проблемы, 
виды ссылок, разрешенных в области цитат, ограничиваются.

Вводятся уровни как количество цитат за вычетом количества склеек, окружающих выражение или определение.

```scala
// level 0
'{ // level 1
  var x = 0
  ${ // level 0
    x += 1
    'x // level 1
  }
}
```

Система разрешает ссылки на глобальные определения, например, `println` на любом уровне, 
но ограничивает ссылки на локальные определения. 
Доступ к локальному определению возможен только в том случае, если оно задано на том же уровне, что и его ссылка. 
Это позволит поймать ошибки в `myBadCounter1` и `myBadCounter2`.

Несмотря на то, что нельзя ссылаться на переменную внутри цитаты, 
все же можно передать ее текущее значение через кавычку, 
подняв значение до выражения с помощью `Expr.apply`.

### Дженерики

При использовании параметров типа или других видов абстрактных типов с кодом в кавычках 
потребуется явно отслеживать некоторые из этих типов. 
Scala использует семантику стертых типов для своих дженериков. 
Это означает, что типы удаляются из программы при компиляции, 
и среде выполнения не нужно отслеживать все типы во время выполнения.

Рассмотрим следующий код:

```scala
def evalAndUse[T](x: Expr[T])(using Quotes) = '{
  val x2: T = $x // error
  ... // use x2
}
```

Здесь будет получено сообщение об ошибке, сообщающее, что не хватает контекстного параметра `Type[T]`. 
Это можно легко исправить, написав:

```scala
def evalAndUse[T](x: Expr[T])(using Type[T])(using Quotes) = '{
  val x2: T = $x
  ... // use x2
}
```

Код будет эквивалентен такой более подробной версии:

```scala
def evalAndUse[T](x: Expr[T])(using t: Type[T])(using Quotes) = '{
  val x2: t.Underlying = $x
  ... // use x2
}
```

Обратите внимание, что у `Type` вызывается член типа `Underlying`, который ссылается на тип, хранящийся в `Type`; 
в данном случае `t.Underlying` есть `T`. 
Даже если `Type` используется неявно, как правило, лучше оставить его контекстуальным, 
так как некоторые изменения внутри цитаты могут потребовать этого. 
Менее подробная версия обычно является лучшим способом написания типов, поскольку ее намного проще читать. 
В некоторых случаях не будет статически известен тип внутри `Type` 
и нужно будет использовать `t.Underlying` для ссылки на него.

Когда нужен этот дополнительный `Type` параметр?
- когда тип является абстрактным и используется на уровне выше текущего

Когда добавляется контекстный параметр `Type` в метод, 
он либо получается из другого параметра контекста, либо неявно с помощью вызова `Type.of`:

```scala
evalAndUse(Expr(3))
// эквивалентно:
evalAndUse[Int](Expr(3))(using Type.of[Int])
```

Не каждый тип можно использовать в качестве параметра `Type.of[..]` из коробки. 
Например, нельзя восстановить абстрактные типы, которые уже были стерты:

```scala
def evalAndUse[T](x: Expr[T])(using Quotes) =
  given Type[T] = Type.of[T] // error
  '{
    val x2: T = $x
    ... // use x2
  }
```

Но можно написать более сложные типы, которые зависят от этих абстрактных типов. 
Например, если ищем или явно создаем `Type[List[T]]`, 
то системе потребуется `Type[T]` в текущем контексте для компиляции.

Хороший код должен добавлять `Types` только к параметрам контекста и никогда не использовать их явно. 
Однако явное использование полезно при отладке, хотя и достигается за счет краткости и ясности.

### ToExpr

Метод `Expr.apply` использует экземпляры `ToExpr` для создания выражения, которое создаст копию значения.

```scala
object Expr:
  def apply[T](x: T)(using Quotes, ToExpr[T]): Expr[T] =
    summon[ToExpr[T]].apply(x)
```

`ToExpr` определяется следующим образом:

```scala
trait ToExpr[T]:
  def apply(x: T)(using Quotes): Expr[T]
```

Метод `ToExpr.apply` примет значение `T` и сгенерирует код, который создаст копию этого значения во время выполнения.

Можно определить собственные `ToExpr`-ы, например:

```scala
given ToExpr[Boolean] with {
  def apply(x: Boolean)(using Quotes) =
    if x then '{true}
    else '{false}
}

given ToExpr[StringContext] with {
  def apply(stringContext: StringContext)(using Quotes) =
    val parts = Varargs(stringContext.parts.map(Expr(_)))
    '{ StringContext($parts: _*) }
}
```

Конструктор `Varargs` просто создает `Expr[Seq[T]]`, который можно эффективно склеить как varargs. 
В общем, любую последовательность `$mySeq: _*` можно соединить, чтобы соединить ее как varargs.

### Шаблоны цитат

Цитаты также можно использовать для проверки эквивалентности одного выражения другому 
или для деконструкции выражения на части.

#### Соответствие точному выражению

Самое простое, что можно сделать, - это проверить, соответствует ли выражение другому известному выражению. 
Пример:

```scala
def valueOfBoolean(x: Expr[Boolean])(using Quotes): Option[Boolean] =
  x match
    case '{ true } => Some(true)
    case '{ false } => Some(false)
    case _ => None

def valueOfBooleanOption(x: Expr[Option[Boolean]])(using Quotes): Option[Option[Boolean]] =
  x match
    case '{ Some(true) } => Some(Some(true))
    case '{ Some(false) } => Some(Some(false))
    case '{ None } => Some(None)
    case _ => None
```

#### Соответствующее частичное выражение

Для большей компактности, можно сопоставить часть выражения, используя склейку (`$`), 
чтобы сматчить произвольный код и извлечь его.

```scala
def valueOfBooleanOption(x: Expr[Option[Boolean]])(using Quotes): Option[Option[Boolean]] =
  x match
    case '{ Some($boolExpr) } => Some(valueOfBoolean(boolExpr))
    case '{ None } => Some(None)
    case _ => None
```

#### Соответствие типов выражений

Также можно сопоставлять код произвольного типа `T`. 
Ниже матчится `$x` типа `T` и на выходе получается `x` типа `Expr[T]`.

```scala
def exprOfOption[T: Type](x: Expr[Option[T]])(using Quotes): Option[Expr[T]] =
  x match
    case '{ Some($x) } => Some(x) // x: Expr[T]
    case '{ None } => Some(None)
    case _ => None
```

Также можно проверить тип выражения:

```scala
def valueOf(x: Expr[Any])(using Quotes): Option[Any] =
  x match
    case '{ $x: Boolean } => valueOfBoolean(x) // x: Expr[Boolean]
    case '{ $x: Option[Boolean] }  => valueOfBooleanOption(x) // x: Expr[Option[Boolean]]
    case _ => None
```

Или аналогично для частичного выражения:

```scala
case '{ Some($x: Boolean) } => // x: Expr[Boolean]
```

#### Соответствующий приемник методов

Когда желательно сопоставить получателя метода, нужно явно указать его тип:

```scala
case '{ ($ls: List[Int]).sum } =>
```

Если бы было написано `$ls.sum`, то нельзя было бы узнать тип `ls` и метод `sum`, который вызывается.

Другой распространенный случай, когда нужны аннотации типов, — это инфиксные операции:

```scala
case '{ ($x: Int) + ($y: Int) } =>
case '{ ($x: Double) + ($y: Double) } =>
case ...
```

#### Сопоставление типов

До сих пор предполагалось, что типы внутри паттернов цитат будут известны статически. 
Шаблоны цитат также допускают общие типы и экзистенциальные типы.

##### Общие типы в шаблонах

Рассмотрим функцию `exprOfOption`:

```scala
def exprOfOption[T: Type](x: Expr[Option[T]])(using Quotes): Option[Expr[T]] =
  x match
    case '{ Some($x: T) } => Some(x) // x: Expr[T]
                // ^^^ type ascription with generic type T
    ...
```

Обратите внимание, что на этот раз `T` добавлен в шаблон явно, хотя его можно было бы вывести. 
Ссылаясь на универсальный тип `T` в шаблоне, в области видимости должен быть доступен `given Type[T]`. 
Это означает, что `$x: T` будет матчиться, только если `x` имеет тип `Expr[T]`. 
В данном конкретном случае это условие всегда будет истинным.

Теперь рассмотрим следующий вариант, где `x` - необязательное значение со (статически) неизвестным типом элемента:

```scala
def exprOfOptionOf[T: Type](x: Expr[Option[Any]])(using Quotes): Option[Expr[T]] =
  x match
    case '{ Some($x: T) } => Some(x) // x: Expr[T]
    case _ => None
```

На этот раз шаблон будет соответствовать только в том случае, если `Some($x: T)` - тип `.OptionSome[T]`

```scala
exprOfOptionOf[Int]('{ Some(3) })   // Some('{3})
exprOfOptionOf[Int]('{ Some("a") }) // None
```

##### Переменные типа в шаблонах

Код в кавычках может содержать типы, неизвестные вне кавычек. 
Можно сопоставить их, используя переменные типа шаблона. 
Как и в обычном шаблоне, переменные типа записываются с использованием имен нижнего регистра.

```scala
def exprOptionToList(x: Expr[Option[Any]])(using Quotes): Option[Expr[List[Any]]] =
  x match
    case '{ Some($x: t) } =>
                // ^^^ this binds the type `t` in the body of the case
      Some('{ List[t]($x) }) // x: Expr[List[t]]
    case '{ None } =>
      Some('{ Nil })
    case _ => None
```

Шаблон `$x: t` будет соответствовать выражению любого типа и `t` будет привязан к типу шаблона. 
Эта переменная типа доступна только в правой части case. 
В этом примере переменная используется для построения списка `List[t]($x)`(`List($x)` тоже сработает). 
Поскольку это тип, который неизвестен статически, нужен `given Type[t]` в области видимости. 
К счастью, приведенный шаблон автоматически это предоставит.

Простой шаблон `case '{ $expr: tpe } =>` очень полезен, если необходимо знать точный тип выражения.

```scala
val expr: Expr[Option[Int]] = ...
expr match
  case '{ $expr: tpe } =>
    Type.show[tpe] // could be: Option[Int], Some[Int], None, Option[1], Option[2], ...
    '{ val x: tpe = $expr; x } // binds the value without widening the type
    ...
```

В некоторых случаях необходимо определить переменную шаблона, 
на которую ссылаются несколько раз или имеющую некоторые ограничения типа. 
Для этого можно создать переменные шаблона в начале шаблона, используя `type t` переменную шаблона типа.

```scala
/**
 * Use: Converts a redundant `list.map(f).map(g)` to only use one call
 * to `map`: `list.map(y => g(f(y)))`.
 */
def fuseMap[T: Type](x: Expr[List[T]])(using Quotes): Expr[List[T]] = x match {
  case '{
    type u
    type v
    ($ls: List[`u`])
      .map($f: `u` => `v`)
      .map($g: `v` => T)
    } =>
    '{ $ls.map(y => $g($f(y))) }
  case _ => x
}
```

Здесь определяются две переменные типа `u` и `v`, а затем к ним идет обращение. 
Обращение идет не напрямую `u` или `v` (без обратных кавычек), 
потому что они будут интерпретироваться как переменные нового типа с тем же именем переменной. 
Эта нотация следует обычному синтаксису 
[шаблонов стабильных идентификаторов (stable identifier patterns)](https://www.scala-lang.org/files/archive/spec/2.13/08-pattern-matching.html#stable-identifier-patterns). 
Кроме того, если переменная типа должна быть ограничена, 
можно добавить ограничения непосредственно к определению типа `case '{ type u <: AnyRef; ... } =>:`

Обратите внимание, что предыдущий случай также может быть записан как `case '{ ($ls: List[u]).map[v]($f).map[T]($g) =>`.

##### Quote types patterns

Типы, представленные с помощью `Type[T]`, можно сопоставить с помощью шаблона `case '[...] =>`.

```scala
def mirrorFields[T: Type](using Quotes): List[String] =
  Type.of[T] match
    case '[field *: fields] =>
      Type.show[field] :: mirrorFields[fields]
    case '[EmptyTuple] =>
      Nil
    case _ =>
      compiletime.error("Expected known tuple but got: " + Type.show[T])

mirrorFields[EmptyTuple]         // Nil
mirrorFields[(Int, String, Int)] // List("Int", "String", "Int")
mirrorFields[Tuple]              // error: Expected known tuple but got: Tuple
```

Как и в случае выражений шаблонов в кавычках, переменные типа представлены с использованием имен нижнего регистра.

### FromExpr

Методы `Expr.value`, `Expr.valueOrError` и `Expr.unapply` 
используют экземпляры `FromExpr` для извлечения значения, если это возможно.

```scala
extension [T](expr: Expr[T]):
  def value(using Quotes)(using fromExpr: FromExpr[T]): Option[T] =
    fromExpr.unapply(expr)

  def valueOrError(using Quotes)(using fromExpr: FromExpr[T]): T =
    fromExpr.unapply(expr).getOrElse(eport.throwError("...", expr))
end extension

object Expr:
  def unapply[T](expr: Expr[T])(using Quotes)(using fromExpr: FromExpr[T]): Option[T] =
    fromExpr.unapply(expr)
```

`FromExpr` определяется следующим образом:

```scala
trait FromExpr[T]:
  def unapply(x: Expr[T])(using Quotes): Option[T]
```

Метод `FromExpr.unapply` примет значение `x` и сгенерирует код, 
который создаст копию этого значения во время выполнения.

Можно определить собственные `FromExprs` следующим образом:

```scala
given FromExpr[Boolean] with {
  def unapply(x: Expr[Boolean])(using Quotes): Option[Boolean] =
    x match
      case '{ true } => Some(true)
      case '{ false } => Some(false)
      case _ => None
}

given FromExpr[StringContext] with {
  def unapply(x: Expr[StringContext])(using Quotes): Option[StringContext] = x match {
    case '{ new StringContext(${Varargs(Exprs(args))}: _*) } => Some(StringContext(args: _*))
    case '{     StringContext(${Varargs(Exprs(args))}: _*) } => Some(StringContext(args: _*))
    case _ => None
  }
}
```

Стоит обратить внимание на то, что были рассмотрены два случая `StringContext`. 
Поскольку это объект _case class_, его можно создать 
с помощью `new StringContext` или `StringContext.apply` из объекта-компаньона. 
Также был использован `Varargs` экстрактор для сопоставления аргументов 
типа `Expr[Seq[String]]` с `Seq[Expr[String]]`. 
Затем был использован `Exprs`, чтобы сопоставить известные константы в `Seq[Expr[String]]` для получения `Seq[String]`.


### Цитаты

`Quotes` - основная точка входа для создания всех цитат. 
Этот контекст обычно просто передается через контекстные абстракции (`using` и `?=>`). 
Каждая область цитаты будет иметь свой собственный `Quotes`. 
Новые области вводятся каждый раз, когда вводится соединение (`${ ... }`). 
Хотя кажется, что splice принимает выражение в качестве аргумента, на самом деле он принимает `Quotes ?=> Expr[T]`. 
Следовательно, можно было бы написать это явно как `${ (using q) => ... }`. 
Это может быть полезно при отладке, чтобы избежать создания имен для этих областей.

Метод `scala.quoted.quotes` обеспечивает простой способ использования `Quotes` без его именования. 
Обычно он импортируется вместе с `Quotes` используя `import scala.quoted.*`.

```scala
${ (using q1) => body(using q1) }
// equivalent to
${ body(using quotes) }
```

Предупреждение: если вы явно назовете `Quotes` `quotes`, вы перетрёте это определение.

Когда пишется splice верхнего уровня в макросе, вызывается что-то похожее на следующее определение. 
Этот splice обеспечит начальное значение `Quotes`, связанное с расширением макроса.

```scala
def $[T](x: Quotes ?=> Expr[T]): T = ...
```

Когда есть splice внутри цитаты, внутренний контекст цитаты будет зависеть от внешнего. 
Эта ссылка представлена с использованием типа `Quotes.Nested`. 
Пользователям цитат почти никогда не понадобится использовать `Quotes.Nested`. 
Эти сведения полезны только для расширенных макросов, 
которые будут проверять код и могут столкнуться с деталями кавычек и splice-ов.

```scala
def f(using q1: Quotes) = '{
  ${ (using q2: q1.Nested) ?=>
      ...
  }
}
```

Можно представить, что вложенный splice подобен следующему методу, где `ctx` - контекст, полученный окружающей цитатой.

```scala
def $[T](using q: Quotes)(x: q.Nested ?=> Expr[T]): T = ...
```

### β-reduction

Когда есть лямбда, применяемая к аргументу в кавычке `'{ ((x: Int) => x + x)(y) }`, 
она не уменьшается внутри кавычки; код сохраняется как есть. 
Существует оптимизация, которая будет β-редуцировать все лямбда-выражения, непосредственно применяемые к параметрам, 
чтобы избежать создания замыкания. 
Это не будет видно с точки зрения цитаты.

Иногда бывает полезно выполнить эту β-редукцию непосредственно на цитатах. 
Для этого используется функция `Expr.betaReduce[T]`, которая получает `Expr[T]` и β-редуцирует, 
если она непосредственно содержит применяемую лямбду.

```scala
Expr.betaReduce('{ ((x: Int) => x + x)(y) }) // returns '{ val x = y; x + x }
```

### Summon values

Есть два способа вызвать значения в макросе.
Во-первых, использовать using параметр во встроенном методе, который явно передается реализации макроса.

```scala
inline def setOf[T](using ord: Ordering[T]): Set[T] =
  ${ setOfCode[T]('ord) }

def setOfCode[T: Type](ord: Expr[Ordering[T]])(using Quotes): Expr[Set[T]] =
  '{ TreeSet.empty[T](using $ord) }
```

В этом случае параметр контекста обнаруживается до развертывания макроса. Если не найден, макрос не будет раскрыт.

Второй способ — использование `Expr.summon`. 
Это позволяет программно искать различные given выражения. 
Следующий пример аналогичен предыдущему примеру:

```scala
inline def setOf[T]: Set[T] =
  ${ setOfCode[T] }

def setOfCode[T: Type](using Quotes): Expr[Set[T]] =
  Expr.summon[Ordering[T]] match
    case Some(ord) => '{ TreeSet.empty[T](using $ord) }
    case _ => '{ HashSet.empty[T] }
```

Разница в том, что во втором сценарии макрос разворачивается перед выполнением неявного поиска. 
Поэтому можно написать произвольный код для обработки случая, когда элемент `Ordering[T]` не найден. 
Здесь используется `HashSet` вместо `TreeSet`, потому что первый не нуждается в `Ordering`.

### Цитатные классы типов

В предыдущем примере было показано, как явно использовать класс типа `Expr[Ordering[T]]`, 
используя предложение аргумента `using`. 
Это хорошо, но не очень удобно, если нужно использовать класс типов несколько раз. 
Чтобы показать это, будем использовать функцию `powerCode`, 
которую можно использовать для любого числового типа.

Во-первых, может быть полезно сделать так, чтобы класс типа `Expr` мог сделать его given параметром. 
Для этого нужно явно указать `powerCode` в `power`, 
потому что есть given `Numeric[Num]`, но требуется `Expr[Numeric[Num]]`. 
Но тогда можно игнорировать его в `powerMacro` и в любом другом месте, которое только его передает.

```scala
inline def power[Num](x: Num, inline n: Int)(using num: Numeric[Num]) =
  ${ powerMacro('x, 'n)(using 'num) }

def powerMacro[Num: Type](x: Expr[Num], n: Expr[Int])(using Expr[Numeric[Num]])(using Quotes): Expr[Num] =
  powerCode(x, n.valueOrAbort)
```

Чтобы использовать этот класс типа, нужен given `Numeric[Num]`,но у нас есть `Expr[Numeric[Num]]`, 
и поэтому нужно склеить это выражение в сгенерированном коде. 
Чтобы сделать его доступным, можно просто соединить его с заданным определением.

```scala
def powerCode[Num: Type](x: Expr[Num], n: Int)(using num: Expr[Numeric[Num]])(using Quotes): Expr[Num] =
  if (n == 0) '{ $num.one }
  else if (n % 2 == 0) '{
    given Numeric[Num] = $num
    val y = $x * $x
    ${ powerCode('y, n / 2) }
  }
  else '{
    given Numeric[Num] = $num
    $x * ${ powerCode(x, n - 1) }
  }
```


---

**References:**
- [Scala 3 Guide](https://docs.scala-lang.org/scala3/guides/macros/quotes.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/metaprogramming/macros.html)
