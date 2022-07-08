---
layout: docsplus
title: "Пересечение типов"
section: scala
prev: type-system/types-generics
next: type-system/types-union
---

## {{page.title}}

Используемый для типов оператор `&` создает так называемый тип пересечения (_intersection type_). 
Тип `A & B` представляет собой значения, которые одновременно относятся как к типу `A`, так и к типу `B`. 
Например, в следующем примере используется тип пересечения `Resettable & Growable[String]`:

```scala
trait Resettable:
  def reset(): Unit

trait Growable[A]:
  def add(a: A): Unit

def f(x: Resettable & Growable[String]): Unit =
  x.reset()
  x.add("first")
```

В методе `f` в этом примере параметр `x` должен быть как `Resettable`, так и `Growable[String]`.

Все члены типа пересечения `A` и `B` являются типом `A` и типом `B`. 
Следовательно, как показано, для `Resettable & Growable[String]` доступны методы `reset` и `add`.

Пересечение типов может быть полезно для структурного описания требований.
В примере выше для `f` мы прямо заявляем, что нас устраивает любое значение для `x`, 
если оно является подтипом как `Resettable`, так и `Growable`. 
Нет необходимости создавать номинальный вспомогательный trait, подобный следующему:

```scala
trait Both[A] extends Resettable, Growable[A]
def f(x: Both[String]): Unit
```

Существует важное различие между двумя вариантами определения `f`: 
в то время как оба позволяют вызывать `f` с экземплярами `Both`, 
только первый позволяет передавать экземпляры, которые являются подтипами `Resettable` и `Growable[String]`, 
но не `Both[String]`.

> Обратите внимание, что `&` коммутативно: `A & B` имеет тот же тип, что и `B & A`.


#### Общие элементы

Если элемент присутствует и в `A`, и в `B`, его тип в `A & B` является пересечением типа в A и типа в B. 
Например, рассмотрим:

```scala
trait A:
  def children: List[A]

trait B:
  def children: List[B]

val x: A & B = new C
val ys: List[A & B] = x.children
```

Тип `children` в `A & B` является пересечением типа `children` в `A` и его типа в `B`, то есть `List[A] & List[B]`. 
Это может быть дополнительно упрощено до `List[A & B]`, потому что `List` является ковариантным.

При определении класса `C`, который наследует `A` и `B`, 
необходимо дать определение метода `children` с требуемым типом:

```scala
class C extends A, B:
  def children: List[A & B] = ???
```

#### Пример

```scala mdoc:silent
trait Book:
  def title: String

trait Audio:
  def track: String

case class AudioBook(title: String, track: String) extends Book, Audio

case class BookAudio(title: String, track: String) extends Audio, Book

trait Library:
  val first: Book
  def items: List[Book]

trait Album:
  val first: Audio
  def items: List[Audio]

class AudiobookLibrary(titles: String*) extends Library, Album:
  private val title: String = titles.head
  val first: Book & Audio = AudioBook(title, "empty")
  def items: List[Book & Audio] =
    titles.map(title => BookAudio("empty", title)).toList

val al = AudiobookLibrary("Пушкин", "Толстой", "Достоевский")
```

```scala mdoc:width=120
val book: Book = al.first
println(book.title)
val books: List[Book] = al.items
books.foreach(b => println(b.title))
val audio: Audio = al.first
println(audio.track)
val audios: List[Audio] = al.items
audios.foreach(a => println(a.track))
```

### Детали

#### Правила подтипа

```
T <: A    T <: B
----------------
  T <: A & B

    A <: T
----------------
    A & B <: T

    B <: T
----------------
    A & B <: T
```

Из приведенных выше правил можно показать, что `&` коммутативно: `A & B <: B & A` для любых `A` и `B`.

```
B <: B           A <: A
----------       -----------
A & B <: B       A & B <: A
---------------------------
       A & B  <:  B & A
```

Другими словами, `A & B` - это тот же тип, что и `B & A`, в том смысле, 
что эти два типа имеют одинаковые значения и являются подтипами друг друга.

Если `C` - конструктор типа, то `C[A] & C[B]` можно упростить, используя следующие три правила:
- если `C` ковариантно, `C[A] & C[B] ~> C[A & B]`
- если `C` контравариантно,` C[A] & C[B] ~> C[A | B]`
- если `C` невариантно, выдается ошибка компиляции

Когда `C` является ковариантным, `C[A & B] <: C[A] & C[B]` можно вывести:

```
    A <: A                  B <: B
  ----------               ---------
  A & B <: A               A & B <: B
---------------         -----------------
C[A & B] <: C[A]          C[A & B] <: C[B]
------------------------------------------
      C[A & B] <: C[A] & C[B]
```

Когда `C` контравариантно, `C[A | B] <: C[A] & C[B]` можно вывести:

```
    A <: A                        B <: B
  ----------                     ---------
  A <: A | B                     B <: A | B
-------------------           ----------------
C[A | B] <: C[A]              C[A | B] <: C[B]
--------------------------------------------------
            C[A | B] <: C[A] & C[B]
```

#### Стирание типов

Стертый тип для `S & T` — это стираемый `glb` (наибольшая нижняя граница) стираемого типа `S` и `T`. 
Правила стирания типов пересечения приведены ниже в псевдокоде:

```
|S & T| = glb(|S|, |T|)

glb(JArray(A), JArray(B)) = JArray(glb(A, B))
glb(JArray(T), _)         = JArray(T)
glb(_, JArray(T))         = JArray(T)
glb(A, B)                 = A                     if A extends B
glb(A, B)                 = B                     if B extends A
glb(A, _)                 = A                     if A is not a trait
glb(_, B)                 = B                     if B is not a trait
glb(A, _)                 = A                     // use first
```

См. также [TypeErasure#erasedGlb](https://github.com/lampepfl/dotty/blob/main/compiler/src/dotty/tools/dotc/core/TypeErasure.scala#L431)

#### Связь с составным типом (with)

Типы пересечения `A & B` заменяют составные типы `A with B`. 
На данный момент синтаксис `A with B` по-прежнему разрешен и интерпретируется как `A & B`, 
но его использование в качестве типа (в отличие от предложения `new` или `extends`) 
будет объявлено устаревшим и удалено в будущем.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-intersection.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/new-types/intersection-types.html)
- [Scala 3 Reference, Details](https://docs.scala-lang.org/scala3/reference/new-types/intersection-types-spec.html)
