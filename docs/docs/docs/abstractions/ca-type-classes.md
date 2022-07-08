---
layout: docsplus
title: "Импл. type классов"
section: scala
prev: abstractions/ca-extension-methods
next: abstractions/ca-type-class-derivation
---

## Имплементация type классов

Класс типов — это абстрактный параметризованный тип, 
который позволяет добавлять новое поведение к любому закрытому типу данных без использования подтипов. 
Это полезно во многих случаях, например:
- выражение того, как тип, которым вы не владеете, например, из стандартной или сторонней библиотеки,
  соответствует такому поведению
- добавление поведения к нескольким типам без введения отношений подтипов между этими типами

В Scala 3 классы типов — это просто trait-ы с одним или несколькими параметрами типа, 
реализации которых предоставляются заданными экземплярами.

### Пример

Рассмотрим `Show` - хорошо известный класс типов в Haskell. 
Следующий код показывает один из способов его реализации в Scala 3. 
Предположим, что классы Scala не имеют метода `toString`. 
Можно определить класс `Show`, чтобы добавить это поведение к любому классу, 
который необходимо преобразовать в пользовательскую строку.

#### Класс типа

Первым шагом в создании класса типа является объявление параметризованного trait, 
который имеет один или несколько абстрактных методов. 
Поскольку у `Showable` есть только один метод с именем `show`, он написан так:

```scala mdoc:silent
// Класс типа
trait Showable[A]:
  extension(a: A) def show: String
```

В Scala 3 это способ сказать, что любой тип, который реализует этот trait, должен определять, как работает метод `show`. 
Обратите внимание, что синтаксис очень близок к обычному trait:

```scala
// a trait
trait Show:
  def show: String
```

Следует отметить несколько важных моментов:
- классы типов, такие как `Showable`, принимают параметр типа `A`, чтобы установить, 
для какого типа предоставляется реализация `show`; Напротив, стандартные trait, такие, как `Show`, этого не делают.
- чтобы добавить функциональность `show` к определенному типу `A`, 
стандартный trait требует, чтобы `A` расширял `Show`, 
в то время как для классов типов требуется реализация `Showable[A]`.
- чтобы разрешить одинаковый синтаксис вызова метода в обоих `Showable`, который имитирует один из `Show`, 
`Showable.show` определяется как метод расширения.

#### Реализация конкретных экземпляров

Следующий шаг — определить, для каких классов должен работать `Showable`, а затем реализовать это поведение. 
Например, чтобы реализовать `Showable` для данного класса `Person`:

```scala mdoc:silent
case class Person(firstName: String, lastName: String)
```

нужно определить `given` значение для `Showable[Person]`. 
Этот код предоставляет конкретный экземпляр `Showable` для класса `Person`:

```scala mdoc:silent
given Showable[Person] with
  extension(p: Person) def show: String =
    s"${p.firstName} ${p.lastName}"
```

Как показано, `Showable[Person]` определяет метод расширения класса `Person` 
и использует ссылку `p` внутри тела метода `show`.

#### Использование класса типов

Этот класс типа можно использовать следующим образом:

```scala mdoc
val person = Person("John", "Doe")
println(person.show)
```

Опять же, если бы в Scala не было метода `toString`, доступного для каждого класса, 
можно было бы использовать эту технику, чтобы добавить поведение `Showable` к любому классу, 
который необходимо преобразовать в `String`.

#### Написание методов, использующих класс типов

Как и в случае с наследованием, можно определить методы, использующие `Showable` в качестве параметра типа:

```scala mdoc
def showAll[S: Showable](xs: List[S]): Unit =
  xs.foreach(x => println(x.show))
showAll(List(Person("Jane", "Jackson"), Person("Mary", "Jameson")))
```

#### Класс типов с несколькими методами

Если необходимо создать класс типов с несколькими методами, исходный синтаксис выглядит следующим образом:

```scala
trait HasLegs[A]:
  extension (a: A)
    def walk(): Unit
    def run(): Unit
```

### Распространенные классы типов

#### Полугруппы и моноиды

Вот определение класса типа `Monoid`:

```scala mdoc:silent
trait SemiGroup[T]:
  extension (x: T) def combine (y: T): T

trait Monoid[T] extends SemiGroup[T]:
  def unit: T
```

Реализация класса типа `Monoid` для типа `String` может быть следующей:

```scala mdoc:silent
given Monoid[String] with
  extension (x: String) def combine (y: String): String = x.concat(y)
  def unit: String = ""
```

Тогда как для типа `Int` можно было бы написать следующее:

```scala mdoc:silent
given Monoid[Int] with
  extension (x: Int) def combine (y: Int): Int = x + y
  def unit: Int = 0
```

Этот моноид теперь можно использовать в качестве привязки к контексту в следующем методе `combineAll`:

```scala mdoc:silent
def combineAll[T: Monoid](xs: List[T]): T =
  xs.foldLeft(summon[Monoid[T]].unit)(_.combine(_))
```

Чтобы избавиться от `summon[...]` можно определить объект `Monoid` следующим образом:

```scala
object Monoid:
  def apply[T](using m: Monoid[T]) = m
```

Что позволило бы переписать метод `combineAll` следующим образом:

```scala
def combineAll[T: Monoid](xs: List[T]): T =
  xs.foldLeft(Monoid[T].unit)(_.combine(_))
```

#### Функторы

Тип `Functor` предоставляет возможность "отображать" свои значения, 
т.е. применять функцию, которая трансформируется внутри значения, сохраняя при этом его форму. 
Например, чтобы изменить каждый элемент коллекции, не удаляя и не добавляя их. 
Можно представить все типы, которые могут быть "отображены" с помощью `F`. 
Это конструктор типа: тип его значений становится конкретным, когда предоставляется аргумент типа. 
Поэтому мы пишем `F[_]`, намекая, что тип `F` принимает в качестве аргумента другой тип. 
Таким образом, определение generic `Functor` будет записано как:

```scala
trait Functor[F[_]]:
  def map[A, B](x: F[A], f: A => B): F[B]
```

Что можно было бы прочитать следующим образом: 
"Конструктор `Functor` типа `F[_]` представляет собой возможность преобразования `F[A]` к `F[B]` 
посредством применения функции `f` с типом `A => B`". 
Определение `Functor` здесь - класс типов. 
Экземпляр `Functor` для типа `List` можно определить следующим образом:

```scala
given Functor[List] with
  def map[A, B](x: List[A], f: A => B): List[B] =
    x.map(f) // в List уже реализован метод `map`
```

С данным экземпляром given в области видимости везде, где доступен `Functor`, 
компилятор примет его для использования с `List`.

Например, можно написать такой метод тестирования:

```scala
def assertTransformation[F[_]: Functor, A, B](expected: F[B], original: F[A], mapping: A => B): Unit =
  assert(expected == summon[Functor[F]].map(original, mapping))
```

И использовать его, например, так:

```scala
assertTransformation(List("a1", "b1"), List("a", "b"), elt => s"${elt}1")
```

Это первый шаг, но на практике желательно, чтобы функция `map` была методом, доступным непосредственно для типа `F`. 
Чтобы можно было экземплярам `F` напрямую обращаться к `map` и избавиться от части `summon[Functor[F]]`. 
Как и в предыдущем примере моноидов, в этом помогают [extension методы](@DOC@abstractions/ca-extension-methods). 
Переопределим класс типов `Functor` с помощью методов расширения.

```scala
trait Functor[F[_]]:
  extension [A](x: F[A])
    def map[B](f: A => B): F[B]
```

Экземпляр `given Functor` для `List` становится:

```scala
given Functor[List] with
  extension [A](xs: List[A])
    def map[B](f: A => B): List[B] =
      xs.map(f)
```

Это упрощает метод `assertTransformation`:

```scala
def assertTransformation[F[_]: Functor, A, B](expected: F[B], original: F[A], mapping: A => B): Unit =
  assert(expected == original.map(mapping))
```

Метод `map` теперь используется непосредственно на `original`. 
Он доступен как метод расширения, так как тип `original` - это `F[A]` - 
и экземпляр `given`, `Functor[F[A]]`, для которого определяется `map`, находится в области видимости.

#### Монады

Применение `map` в `Functor[List]` к функции отображения типа `A => B` приводит к созданию `List[B]`. 
Таким образом, применение его к функции отображения типа `A => List[B]` приводит к созданию `List[List[B]]`. 
Чтобы избежать управления списками списков, желательно "свести" значения в один список.

Вот здесь появляются `Monad`-ы. 
`Monad`-а для `F[_]` — это `Functor[F]` + еще две операции:
- `flatMap`, который превращает `F[A]` в `F[B]` при заданной функции типа `A => F[B]`,
- `pure`, который создает `F[A]` из одного значения `A`.

Определение монады:

```scala
trait Monad[F[_]] extends Functor[F]:

  /** Оборачивание в монаду */
  def pure[A](x: A): F[A]

  extension [A](x: F[A])
    /** Основная операция композиции */
    def flatMap[B](f: A => F[B]): F[B]

    /** Операция `map` может быть определена в терминах `flatMap` */
    def map[B](f: A => B) = x.flatMap(f.andThen(pure))

end Monad
```

##### Список

`List` можно превратить в монаду через следующий экземпляр `given`:

```scala
given listMonad: Monad[List] with
  def pure[A](x: A): List[A] =
    List(x)
  extension [A](xs: List[A])
    def flatMap[B](f: A => List[B]): List[B] =
      xs.flatMap(f) // можно использовать уже существующий `flatMap` из `List`
```

Поскольку `Monad` является подтипом `Functor`, `List` также является функтором. 
Метод функтора `map` уже реализован в `trait Monad`, поэтому экземпляру не нужно определять его явно.

##### Option

`Option` - ещё один тип, имеющий такое же поведение:

```scala
given optionMonad: Monad[Option] with
  def pure[A](x: A): Option[A] =
    Option(x)
  extension [A](xo: Option[A])
    def flatMap[B](f: A => Option[B]): Option[B] = xo match
      case Some(x) => f(x)
      case None => None
```

##### Reader

Другим примером `Monad`-ы является монада `Reader`, которая работает с функциями, 
а не с типами данных, такими как `List` или `Option`. 
Его можно использовать для объединения нескольких функций, которым нужен один и тот же параметр. 
Например, когда нескольким функциям требуется доступ к некоторой конфигурации, контексту, переменным среды и т. д.

Давайте определим тип `Config` и две функции, использующие его:

```scala
trait Config
// ...
def compute(i: Int)(config: Config): String = ???
def show(str: String)(config: Config): Unit = ???
```

Желательно объединить `compute` и `show` в единую функцию, принимающую параметр `Config` 
и показывающую результат вычисления.
Также желательно использовать монаду, чтобы избежать явной передачи параметра несколько раз. 
Таким образом, постулируя правильную операцию `flatMap`, можно было бы написать так:

```scala
def computeAndShow(i: Int): Config => Unit = compute(i).flatMap(show)
```

вместо

```scala
show(compute(i)(config))(config)
```

Определим такую монаду. 
Во-первых, мы собираемся определить тип с именем `ConfigDependent`, 
представляющий функцию, которая при передаче создает `Result` из `Config`.

```scala
type ConfigDependent[Result] = Config => Result
```

Экземпляр монады будет выглядеть так:

```scala
given configDependentMonad: Monad[ConfigDependent] with

  def pure[A](x: A): ConfigDependent[A] =
    config => x

  extension [A](x: ConfigDependent[A])
    def flatMap[B](f: A => ConfigDependent[B]): ConfigDependent[B] =
      config => f(x(config))(config)

end configDependentMonad
```

Тип `ConfigDependent` может быть записан с использованием [лямбда-выражений типа](@DOC@type-system/type-lambdas):

```scala
type ConfigDependent = [Result] =>> Config => Result
```

Использование этого синтаксиса превратит предыдущий `configDependentMonad` в:

```scala
given configDependentMonad: Monad[[Result] =>> Config => Result] with

  def pure[A](x: A): Config => A =
    config => x

  extension [A](x: Config => A)
    def flatMap[B](f: A => Config => B): Config => B =
      config => f(x(config))(config)

end configDependentMonad
```

Вполне вероятно, что мы бы также хотели использовать этот паттерн с другими типами окружения, не только с `trait Config`. 
Монада `Reader` позволяет абстрагировать `Config` в параметр типа, названный `Ctx` в следующем определении:

```scala
given readerMonad[Ctx]: Monad[[X] =>> Ctx => X] with

  def pure[A](x: A): Ctx => A =
    ctx => x

  extension [A](x: Ctx => A)
    def flatMap[B](f: A => Ctx => B): Ctx => B =
      ctx => f(x(ctx))(ctx)

end readerMonad
```

### Резюме

Определение класса типа выражается с помощью параметризованного типа с абстрактными элементами, такими как `trait`. 
Основное различие между полиморфизмом подтипа и специальным полиморфизмом с классами типов заключается в том, 
как реализуется определение класса типов по отношению к типу, на который он действует. 
В случае класса типов его реализация для конкретного типа выражается через определение экземпляра `given`, 
предоставляемый как неявный аргумент вместе со значением, на которое он действует. 
При полиморфизме подтипов реализация смешивается с родительскими элементами класса, 
и для выполнения полиморфной операции требуется только один терм. 
Решение класса типов требует больше усилий для настройки, но оно более расширяемо: 
добавление нового интерфейса в класс требует изменения исходного кода этого класса. 
Напротив, экземпляры классов типов могут быть определены где угодно.

В заключение мы увидели, что trait-ы и экземпляры given в сочетании с другими конструкциями, 
такими как методы расширения, границы контекста и лямбда-выражения типов, 
позволяют получить краткое и естественное выражение классов типов.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/ca-type-classes.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/contextual/type-classes.html)
