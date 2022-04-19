---
layout: docs
title: "Объединение типов"
---

## {{page.title}}

Используемый для типов `|` оператор создает так называемый тип объединения (_union type_). 
Тип `А | B` представляет значения, которые относятся **либо** к типу `A`, **либо** к типу `B`.

В следующем примере метод `help` принимает параметр с именем `id` типа объединения `Username | Password`, 
который может быть либо `Username`, либо `Password`:

```scala
case class Username(name: String)
case class Password(hash: Hash)

def help(id: Username | Password) =
  val user = id match
    case Username(name) => lookupName(name)
    case Password(hash) => lookupPassword(hash)
  // ...
```

`help` реализуется используя pattern matching.

Этот код является гибким и типобезопасным решением. 
Если попытаться передать тип, отличный от `Username` или `Password`, компилятор пометит это как ошибку:

```scala
help("hi")   // error: Found: ("hi" : String)
             //        Required: Username | Password         
```

Ошибка также будет получена, если попытаться добавить `case` в выражение `match`, 
которое не соответствует типам `Username` или `Password`:

```scala
case 1.0 => ???   // ERROR: this line won’t compile
```

#### Альтернатива объединенным типам

Как показано, объединенные типы могут использоваться для представления вариантов нескольких разных типов, 
не требуя, чтобы эти типы были частью специально созданной иерархии классов.

##### Предварительное планирование иерархии классов

Другие языки требуют предварительного планирования иерархии классов, как показано в следующем примере:

```scala
trait UsernameOrPassword
case class Username(name: String) extends UsernameOrPassword
case class Password(hash: Hash) extends UsernameOrPassword
def help(id: UsernameOrPassword) = ...
```

Предварительное планирование не очень хорошо масштабируется, поскольку, 
например, требования пользователей API могут быть непредсказуемыми. 
Кроме того, загромождение иерархии типов маркерами типа `UsernameOrPassword` затрудняет чтение кода.

##### Теговые объединения

Другой альтернативой является задание отдельного типа перечисления, например:

```scala
enum UsernameOrPassword:
  case IsUsername(u: Username)
  case IsPassword(p: Password)
```

Перечисление `UsernameOrPassword` представляет собой помеченное объединение `Username` и `Password`. 
Однако этот способ моделирования объединения требует явной упаковки и распаковки, 
и, например, `Username` не является подтипом `UsernameOrPassword`.

#### Вывод типов объединения

Компилятор присваивает типу объединения выражение, только если такой тип явно задан. 
Например, рассмотрим такие значения:

```scala mdoc:invisible
case class Username(name: String)
case class Password(hash: Int)
```
```scala mdoc
val name = Username("Eve")   
val password = Password(123) 
```

В этом примере показано, как можно использовать тип объединения при привязке переменной к результату выражения `if`/`else`:

```scala mdoc
val a = if (true) name else password
val b: Password | Username = if (true) name else password
```

Типом `a` является `Object`, который является супертипом `Username` и `Password`, 
но не наименьшим супертипом, `Password | Username`. 
Если необходим наименьший супертип, его нужно указать явно, как это делается для `b`.

> Типы объединения являются двойственными типам пересечения. 
> И как `&` с типами пересечения, `|` также коммутативен: `A | B` того же типа, что и `B | А`.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-union.html)
