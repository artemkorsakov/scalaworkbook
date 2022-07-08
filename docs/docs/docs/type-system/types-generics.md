---
layout: docsplus
title: "Generics типы"
section: scala
prev: type-system/types-inferred
next: type-system/types-intersection
---

## {{page.title}}

Универсальные (generic) классы (или trait-ы) принимают тип в качестве параметра в квадратных скобках `[...]`.
Для обозначения параметров типа согласно конвенции Scala используется одна заглавная буква (например, `A`). 
Затем этот тип можно использовать внутри класса по мере необходимости 
для параметров экземпляра метода или для возвращаемых типов:

```scala mdoc:silent
// здесь мы объявляем параметр типа A
//          v
class Stack[A]:
  private var elements: List[A] = Nil
  //                         ^
  //  здесь мы ссылаемся на этот тип
  //          v
  def push(x: A): Unit = { elements = elements.prepended(x) }
  def peek: A = elements.head
  def pop(): A =
    val currentTop = peek
    elements = elements.tail
    currentTop
```

Эта реализация класса `Stack` принимает любой тип в качестве параметра. 
Прелесть дженериков состоит в том, что теперь можно создавать `Stack[Int]`, `Stack[String]` и т. д., 
что позволяет повторно использовать реализацию `Stack` для произвольных типов элементов.

Пример создания и использования `Stack[Int]`:

```scala mdoc:silent
val stack = Stack[Int]
stack.push(1)
stack.push(2)
```
```scala mdoc
println(stack.pop())
println(stack.pop())
```

> Подробности о том, как выразить ковариантность с помощью универсальных типов, см. в разделе ["Ковариантность"](types-variance).


### Верхнее ограничение типа

Параметры типа и члены абстрактного типа могут быть ограничены определенными диапазонами. 
Такие диапазоны ограничивают конкретные значение типа 
и, возможно, предоставляют больше информации о членах таких типов. 
Верхнее ограничение типа `T <: A` указывает на то что тип `T` относится к подтипу типа `A`. 
Приведем пример, демонстрирующий верхнее ограничение для типа класса `PetContainer`:

```scala mdoc:silent:reset
abstract class Animal:
  def name: String

abstract class Pet extends Animal

class Cat extends Pet:
  override val name: String = "Cat"

class Dog extends Pet:
  override val name: String = "Dog"

class Lion extends Animal:
  override val name: String = "Lion"

class PetContainer[P <: Pet](p: P):
  def pet: P = p

val dogContainer = PetContainer[Dog](Dog())
val catContainer = PetContainer[Cat](Cat())
```

Класс `PetContainer` принимает тип `P`, который должен быть подтипом `Pet`. 
`Dog` и `Cat` - это подтипы `Pet`, поэтому можно создать новые `PetContainer[Dog]` и `PetContainer[Cat]`. 
Однако, если попытаться создать `PetContainer[Lion]`, то получим следующую ошибку:

```scala mdoc:fail
val lionContainer = PetContainer[Lion](Lion())
```

Это потому, что `Lion` не является подтипом `Pet`.


### Нижнее ограничение типа

В то время как верхнее ограничение типа ограничивает тип до подтипа стороннего типа, 
нижнее ограничение типа объявляют тип супертипом стороннего типа. 
Термин `B >: A` выражает то, что параметр типа `B` или абстрактный тип `B` относится к супертипу типа `A`. 
В большинстве случаев `A` будет задавать тип класса, а `B` - тип метода.

Вот пример, где это полезно:

```scala
trait Node[+B]:
  def prepend(elem: B): Node[B]

case class ListNode[+B](h: B, t: Node[B]) extends Node[B]:
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t

case class Nil[+B]() extends Node[B]:
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
```

В данной программе реализован связанный список. 
`Nil` представляет пустой список. Класс `ListNode` - это узел, 
который содержит элемент типа `B` (`head`) и ссылку на остальную часть списка (`tail`). 
Класс `Node` и его подтипы ковариантны, потому что указанно `+B`.

Однако эта программа не скомпилируется, 
потому что параметр `elem` в `prepend` имеет тип `B`, который объявлен ковариантным. 
Так это не работает, потому что функции контрвариантны в типах своих параметров 
и ковариантны в типах своих результатов.

Чтобы исправить это, необходимо перевернуть вариантность типа параметра `elem` в `prepend`. 
Для этого вводится новый тип для параметра `U`, у которого тип `B` указан в качестве нижней границы типа.

```scala mdoc:reset
trait Node[+B]:
  def prepend[U >: B](elem: U): Node[U]
case class ListNode[+B](h: B, t: Node[B]) extends Node[B]:
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
case class Nil[+B]() extends Node[B]:
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
```

Теперь можно сделать следующее:

```scala mdoc
trait Bird
case class AfricanSwallow() extends Bird
case class EuropeanSwallow() extends Bird
val africanSwallowList = ListNode[AfricanSwallow](AfricanSwallow(), Nil())
val birdList: Node[Bird] = africanSwallowList
birdList.prepend(EuropeanSwallow())
```

Переменной с типом `Node[Bird]` можно присвоить значение `africanSwallowList`, а затем добавить и `EuropeanSwallow`.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/types-generics.html)
- [Scala tour, Upper type bounds](https://docs.scala-lang.org/ru/tour/upper-type-bounds.html)
- [Scala tour, Lower type bounds](https://docs.scala-lang.org/ru/tour/lower-type-bounds.html)
