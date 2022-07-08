---
layout: docsplus
title: "Поиск по типу"
section: scala
prev: scaladoc/site-versioning
next: scaladoc/snippet-compiler
---

## {{page.title}}

Поиск функций по их символическим именам может занять много времени. 
Именно поэтому новый scaladoc позволяет искать методы и поля по их типам.

Рассмотрим следующее определение метода расширения:

```
extension [T](arr: IArray[T]) def span(p: T => Boolean): (IArray[T], IArray[T]) = ...
```

Вместо поиска `span` также можно искать `IArray[A] => (A => Boolean) => (IArray[A], IArray[A])`.

Чтобы использовать эту функцию, введите сигнатуру искомого элемента в строке поиска scaladoc. 
Вот как это работает:

![](https://docs.scala-lang.org/resources/images/scala3/scaladoc/inkuire-1.0.0-M2_js_flatMap.gif)

Эта функция предоставляется поисковой системой 
[Inkuire, которая работает для Scala 3 и Kotlin](https://github.com/VirtusLab/Inkuire). 
Чтобы быть в курсе развития этой функции, следите за репозиторием Inkuire.


### Примеры запросов

Некоторые примеры запросов с предполагаемыми результатами:
- `List[Int] => (Int => Long) => List[Long] -> map`
- `Seq[A] => (A => B) => Seq[B] -> map`
- `(A, B) => A -> _1`
- `Set[Long] => Long => Boolean -> contains`
- `Int => Long => Int -> const`
- `String => Int => Char -> apply`
- `(Int & Float) => (String | Double) -> toDouble, toString`
- `F[A] => Int -> length`


### Синтаксис запроса

Для того чтобы запрос панели поиска scaladoc выполнялся с использованием Inkuire вместо поисковой системы по умолчанию, 
запрос должен содержать последовательность символов `=>`.

Принятый ввод аналогичен сигнатуре каррированной функции в Scala 3. С некоторыми отличиями:
- AndTypes, OrTypes и Functions должны быть заключены в круглые скобки, например, `(Int & Any) => String`
- поля и методы без параметров можно найти, указав перед их типом `=>`, например, `=> Int`
- Можно использовать подстановочный знак `_`, чтобы указать, 
что необходимо сопоставить любой тип в данном месте, например, `Long => Double => _`
- Типы в виде одной буквы, например `A`, или буквы с цифрой `X1`, автоматически считаются переменными типа.
- Другие переменные типа могут быть объявлены так же, как и в полиморфных функциях, 
например `[AVariable, AlsoAVariable] => AVariable => AlsoAVariable => AVariable`

#### Работа с псевдонимами типов и приемниками методов

Когда дело доходит до того, как код сопоставляется с записями InkuireDb, 
есть некоторые преобразования, чтобы сделать движок более самостоятельным (хотя и открытым для предложений и изменений). 
Во-первых, получатель (не владелец модуля) функции может рассматриваться как первый аргумент. 
Также применяется автоматическое каррирование, чтобы результаты не зависели от списков аргументов. 
При поиске совпадений `val` и `def` не различаются.

Итак, по запросу `Num => Int => Int => Int` должны быть найдены следующие объявления:

```text
class Num():
  def a(i: Int, j: Int): Int
  def b(i: Int)(j: Int): Int
  def c(i: Int): (Int => Int)
  val d: Int => Int => Int
  val e: Int => Int => Int
  val f: (Int, Int) => Int
end Num

def g(i: Num, j: Int, k: Int): Int
extension (i: Num) def h(j: Int, k: Int): Int
def i(i: Num, j: Int)(k: Int): Int
extension (i: Num) def j(j: Int)(k: Int): Int
...
```

Когда дело доходит до псевдонимов типов, они обесцениваются как в объявлении, так и в подписи запроса. 
Это означает, что для объявлений:

```scala
type Name = String

def fromName(name: Name): String
def fromString(str: String): Name
```

оба метода `fromName` и `fromString`, должны быть найдены 
для запросов `Name => Name`, `String => String`, `Name => String` и `String => Name`.


### Как это работает

Inkuire работает как рабочий JavaScript в браузере благодаря мощи [ScalaJS](https://www.scala-js.org/).

Чтобы включить Inkuire при запуске scaladoc, добавьте флаг `-Ygenerate-inkuire`. 
При добавлении этого флага создаются два файла:
- `inkuire-db.json` - это файл, содержащий все доступные для поиска объявления 
из текущего документированного проекта в формате, читаемом поисковой системой Inkuire.
- `inkuire-config.json` - этот файл содержит расположение файлов базы данных, 
которые должны быть доступны для поиска в документации текущего проекта. 
По умолчанию он будет сгенерирован с расположением локального файла базы данных, 
а также с подразумеваемыми по умолчанию расположениями файлов базы данных 
[во внешних сопоставлениях `-external-mappings`](@DOC@scaladoc/settings).


---

**References:**
- [Scaladoc Guide](https://docs.scala-lang.org/scala3/guides/scaladoc/search-engine.html)
