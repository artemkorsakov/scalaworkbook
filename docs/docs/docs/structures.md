---
layout: docsplus
title: "Структуры управления"
section: scala
prev: types
next: modeling
---

## {{page.title}}

В Scala есть все ожидаемые структуры управления, в том числе:
- `if`/`then`/`else`
- циклы `for`
- циклы `while`
- `try`/`catch`/`finally`

Здесь также есть две другие мощные конструкции, присутствующие не во всех языках программирования:
- `for` выражения (также известные как _for comprehensions_)
- `match` выражения

### if/else

Однострочное `if` выражение выглядит так:

```scala mdoc:silent
val x = 1
```
```scala mdoc
if x == 1 then println(x)
```

Когда необходимо выполнить несколько строк кода после `if`, используется синтаксис:

```scala mdoc
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
```

`if`/`else` синтаксис выглядит так:

```scala mdoc
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
else
  println("x was not 1")
```

`if`/`else if`/`else` выглядит так же, как и в других языках:

```scala mdoc
def detect(x: Int) = 
  if x < 0 then
    println("negative")
  else if x == 0 then
    println("zero")
  else
    println("positive")
detect(-1)    
detect(0) 
detect(1) 
```

При желании можно дополнительно включить оператор `end if` в конце каждого выражения:

```scala mdoc:silent
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
end if
```

#### if/else выражение всегда возвращает результат

Сравнения `if/else` образуют выражения - это означает, что они возвращают значение,  которое можно присвоить переменной.
Поэтому нет необходимости в специальном тернарном операторе. 
Пример:

```scala
val minValue = if a < b then a else b
```

Можно использовать `if/else` выражение в качестве тела метода:

```scala
def compare(a: Int, b: Int): Int =
  if a < b then -1
  else if a == b then 0
  else 1
```

Как будет видно дальше, все структуры управления Scala можно использовать в качестве выражений.

> Программирование, ориентированное на выражения (_expression-oriented programming_ или _EOP_) -
> стиль разработки, когда каждое написанное выражение возвращает значение. 
> 
> И наоборот, строки кода, которые не возвращают значения, называются операторами или утверждениями 
> и используются для получения побочных эффектов. 
> 
> По мере погружения в Scala можно обнаружить, что пишется больше выражений и меньше утверждений.


### for loops

В самом простом случае цикл `for` в Scala можно использовать для перебора элементов в коллекции. 
Например, имея последовательность целых чисел, можно перебрать ее элементы и вывести значения следующим образом:

```scala mdoc:silent
val ints = List(1, 2, 3, 4, 5)
```
```scala mdoc
for i <- ints do println(i)
```

Код `i <- ints` называется генератором.

Если необходим многострочный блок кода после генератора `for`, используется следующий синтаксис:

```scala mdoc
for
  i <- ints
do
  val x = i * 2
  println(s"i = $i, x = $x")
```

#### Несколько генераторов

В цикле `for` можно использовать несколько генераторов, например:

```scala mdoc
for
  i <- 1 to 2
  j <- 'a' to 'b'
  k <- 1 to 10 by 5
do
  println(s"i = $i, j = $j, k = $k")
```

#### Guards

Циклы `for` также могут содержать условия, называемые _guards_:

```scala mdoc
for
  i <- 1 to 5
  if i % 2 == 0
do
  println(i)
```

Можно добавлять столько условий, сколько необходимо:

```scala mdoc
for
  i <- 1 to 10
  if i > 3
  if i < 6
  if i % 2 == 0
do
  println(i)
```

#### Использование for с Map-ами

Циклы `for` можно использовать с `Map`-ами.
Например, если есть карта ключ/значение:

```scala mdoc:silent
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama", 
  "AR" -> "Arizona"
)
```

Можно обойти все пары ключ/значение так:

```scala mdoc
for (abbrev, fullName) <- states do println(s"$abbrev: $fullName")
```

Когда цикл `for` перебирает `Map`, каждая пара ключ/значение привязывается к переменным `abbrev` и `fullName`.
По мере выполнения цикла переменная `abbrev` принимает значение текущего ключа, 
а переменная `fullName` - соответствующему ключу значению.

### for expressions

В предыдущих примерах все циклы `for` использовались для побочных эффектов, 
в частности, для вывода результата в STDOUT с помощью `println`.

Важно знать, что `for` также можно использовать для выражений, возвращающих значения. 
Для этого `for` создается с ключевым словом `yield` вместо `do` и возвращаемым выражением, например:

```scala mdoc
val list =
  for
    i <- 10 to 12
  yield
    i * 2
```

После присваивания `list` содержит `Vector` с отображаемыми значениями. Вот как работает это выражение:
- Выражение `for` начинает перебирать значения в диапазоне `(10, 11, 12)`. Сначала оно работает со значением `10`, 
умножает его на `2`, затем выдает результат - `20`.
- Далее берет `11` — второе значение в диапазоне. Умножает его на `2`, 
а затем выдает значение `22`. Можно представить эти полученные значения как накопление во временном хранилище.
- Наконец, цикл берет число `12` из диапазона, умножает его на `2`, получая число `24`. 
Цикл завершается в этой точке и выдает конечный результат - `(20, 22, 24)`.

В данном случае показанное выражение `for` эквивалентно вызову метода `map`:

```scala mdoc:reset
val list = (10 to 12).map(i => i * 2)
```

Выражения `for` можно использовать всегда, когда нужно обойти все элементы в коллекции 
и применить алгоритм к этим элементам для создания нового списка. 

Вот пример, который показывает, как использовать блок кода после `yield`:

```scala mdoc:reset
val names = List("_olivia", "_walter", "_peter")
val capNames = for name <- names yield
  val nameWithoutUnderscore = name.drop(1)
  val capName = nameWithoutUnderscore.capitalize
  capName
```

Поскольку выражение `for` возвращает результат, его можно использовать в качестве тела метода. 
Пример:

```scala mdoc
def between3and10(xs: List[Int]): List[Int] =
  for
    x <- xs
    if x >= 3
    if x <= 10
  yield x
between3and10(List(1, 3, 7, 11)) 
```

### while loops

Цикл `while` имеет следующий синтаксис:

```scala mdoc
var x = 1
while
  x < 3
do
  println(x)
  x += 1
```

> В Scala не приветствуется использование изменяемых переменных `var`, поэтому следует избегать `while`.
> Аналогичный результат можно достигнуть используя вспомогательный метод:
> ```
> def loop(x: Int): Unit =
>   if x < 3 then
>     println(x)
>     loop(x + 1)  
> loop(1)
> ```

### match expressions

Сопоставление с образцом (pattern matching) является основой функциональных языков программирования, 
и Scala включает в себя pattern matching, обладающий множеством возможностей.

В самом простом случае можно использовать выражение `match`, подобное оператору Java `switch`, 
сопоставляя на основе целочисленного значения. 
Как и предыдущие структуры, pattern matching - это действительно выражение, поскольку оно вычисляет результат:

```scala mdoc
import scala.annotation.switch
val i = 6
val day = (i: @switch) match
  case 0 => "Sunday"
  case 1 => "Monday"
  case 2 => "Tuesday"
  case 3 => "Wednesday"
  case 4 => "Thursday"
  case 5 => "Friday"
  case 6 => "Saturday"
  case _ => "invalid day"
```

В примере выше переменная `i` сопоставляется с числом и если равна от 0 до 6, то в `day` возвращается день недели.
Иной случай обозначается символом `_` и если `i` не равен от 0 до 6, то возвращается значение `invalid day`.

> При написании простых выражений соответствия, подобных этому, рекомендуется использовать аннотацию `@switch` для переменной `i`. 
> Эта аннотация содержит предупреждение во время компиляции, если _switch_ не может быть скомпилирован в _tableswitch_ 
> или _lookupswitch_, которые лучше подходят с точки зрения производительности.

#### Значение по умолчанию

Когда нужно получить доступ к универсальному значению по умолчанию в pattern matching, 
достаточно указать имя переменной в левой части оператора `case`, 
а затем использовать это имя в правой части оператора:

```scala mdoc
i match
  case 0 => println("1")
  case 1 => println("2")
  case what => println(s"Получено значение: $what" )
```

Переменной можно дать любое допустимое имя. Можно также использовать `_` в качестве имени, чтобы игнорировать значение.

#### Обработка нескольких возможных значений в одной строке

В этом примере показано, как использовать несколько возможных совпадений с образцом в каждом операторе `case`:

```scala mdoc
val evenOrOdd = i match
  case 1 | 3 | 5 | 7 | 9 => println("odd")
  case 2 | 4 | 6 | 8 | 10 => println("even")
  case _ => println("some other number")
```

#### Использование if в pattern matching

В pattern matching можно использовать условия:

```scala mdoc
i match
  case 1 => println("one, a lonely number")
  case x if x == 2 || x == 3 => println("two’s company, three’s a crowd")
  case x if x > 3 => println("4+, that’s a party")
  case _ => println("i’m guessing your number is zero or less")
```

Ещё пример:

```scala mdoc
i match
  case a if 0 to 9 contains a => println(s"0-9 range: $a")
  case b if 10 to 19 contains b => println(s"10-19 range: $b")
  case c if 20 to 29 contains c => println(s"20-29 range: $c")
  case _ => println("Hmmm...")
```

#### case classes и выражение match

Также можно извлекать поля из `case class`-ов — и классов, которые имеют правильно написанные методы `apply`/`unapply` — 
и использовать их в pattern matching. 
Вот пример использования простого `case class Person`

```scala mdoc
case class Person(name: String)
def speak(p: Person) = p match
  case Person(name) if name == "Fred" => println(s"$name says, Yubba dubba doo")
  case Person(name) if name == "Bam Bam" => println(s"$name says, Bam bam!")
  case _ => println("Watch the Flintstones!")
speak(Person("Fred"))
speak(Person("Bam Bam"))
speak(Person("Wilma"))
```

#### Использование выражения match в теле метода

Поскольку выражения match возвращают значение, их можно использовать в теле метода. 
Этот метод принимает значение `Matchable` в качестве входного параметра 
и возвращает логическое значение на основе результата выражения соответствия:

```scala mdoc
def isTruthy(a: Matchable) = a match
  case 0 | "" | false => false
  case _              => true
```

Входной параметр `a` определяется как тип `Matchable`, который является родителем всех типов Scala.
Для `Matchable` может выполняться сопоставление с образцом.
Метод реализуется путем сопоставления входных данных, обеспечивая два случая: 
первый проверяет, является ли заданное значение целым числом `0`, пустой строкой или `false`, 
и в этом случае возвращает `false`. 
Для иных случаев возвращается значение `true`. 

Эти примеры показывают, как работает метод:

```scala mdoc
isTruthy(0)
isTruthy(false)
isTruthy("")
isTruthy(1)
isTruthy(" ")
isTruthy(2F)
```

Использование pattern matching в качестве тела метода очень распространено.

#### Использование различных шаблонов в pattern matching

Для выражения `match` можно использовать множество различных шаблонов. Например:
- Сравнение с константой (`case 3 =>`)
- Сравнение с последовательностями (`case List(els : _*) =>`)
- Сравнение с кортежами (`case (x, y) =>`)
- Сравнение с конструктором класса (`case Person(first, last) =>`)
- Сравнение по типу (`case p: Person =>`)

Все эти виды шаблонов показаны в следующем примере:

```scala
def pattern(x: Matchable): String = x match

  // Сравнение с константой
  case 0 => "ноль"
  case true => "true"
  case "hello" => "строка 'hello'"
  case Nil => "пустой List"

  // Сравнение с последовательностями
  case List(0, _, _) => "список из 3 элементов с 0 в качестве первого элемента"
  case List(1, _*) => "Непустой список, начинающийся с 1, и имеющий любой размер > 0"
  case Vector(1, _*) => "Vector, начинающийся с 1, и имеющий любой размер > 0"

  // Сравнение с кортежами
  case (a, b) => s"получено $a и $b"
  case (a, b, c) => s"получено $a, $b и $c"

  // Сравнение с конструктором класса
  case Person(first, "Alexander") => s"Alexander, first name = $first"
  case Dog("Zeus") => "Собака с именем Zeus"

  // Сравнение по типу
  case s: String => s"получена строка: $s"
  case i: Int => s"получено число: $i"
  case f: Float => s"получено число с плавающей точкой: $f"
  case a: Array[Int] => s"массив чисел: ${a.mkString(",")}"
  case as: Array[String] => s"массив строк: ${as.mkString(",")}"
  case d: Dog => s"Экземпляр класса Dog: ${d.name}"
  case list: List[?] => s"получен List: $list"
  case m: Map[?, ?] => m.toString

  // Сравнение по умолчанию
  case _ => "Unknown"
```

#### Дополнительные возможности выражений match

`match` выражения могут быть объединены в цепочку:

```scala mdoc:reset
def chain(xs: List[Int]) =
  xs match
    case Nil => "empty"
    case _   => "nonempty"
  match
    case "empty"    => 0
    case "nonempty" => 1

chain(List.empty[Int])
chain(List(1, 2, 3))
```


### try/catch/finally

Как и в Java, в Scala есть конструкция `try`/`catch`/`finally`, позволяющая перехватывать исключения и управлять ими. 
Для обеспечения согласованности Scala использует тот же синтаксис, что и выражения `match`, 
и поддерживает pattern matching для различных возможных исключений.

В следующем примере `openAndReadAFile` - это метод, который выполняет то, что следует из его названия: 
он открывает файл и считывает текст в нем, присваивая результат изменяемой переменной `text`:

```scala
var text = ""
try
  text = openAndReadAFile(filename)
catch
  case fnf: FileNotFoundException => fnf.printStackTrace()
  case ioe: IOException => ioe.printStackTrace()
finally
  println("Здесь необходимо закрыть ресурсы.")
```

Предполагая, что метод `openAndReadAFile` использует Java `java.io.*` классы для чтения файла 
и не перехватывает его исключения, попытка открыть и прочитать файл может привести как к `FileNotFoundException`, 
так и к `IOException`, и эти два исключения перехватываются в блоке `catch` этого примера.

---

**References:**
- [Scala3 book, taste Control Structures](https://docs.scala-lang.org/scala3/book/taste-control-structures.html)
- [Scala3 book, Control Structures](https://docs.scala-lang.org/scala3/book/control-structures.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/changed-features/match-syntax.html)
