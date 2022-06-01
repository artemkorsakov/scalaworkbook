---
layout: docsplus
title: "Верхнеур. определения"
prev: packaging
next: collections
---

## Верхнеуровневые определения

В Scala 3 все виды определений могут быть записаны на "верхнем уровне" файлов исходного кода. 
Например, можно создать файл с именем `MyCoolApp.scala` и поместить в него данное содержимое:

```scala
import scala.collection.mutable.ArrayBuffer

enum Topping:
  case Cheese, Pepperoni, Mushrooms

import Topping.*
class Pizza:
  val toppings = ArrayBuffer[Topping]()

val p = Pizza()

extension (s: String)
  def capitalizeAllWords = s.split(" ").map(_.capitalize).mkString(" ")

val hwUpper = "hello, world".capitalizeAllWords

type Money = BigDecimal

// по желанию дополнительные определения...

@main def myApp =
  p.toppings += Cheese
  println("show me the code".capitalizeAllWords)
```

Как показано, нет необходимости помещать эти определения внутри пакета, класса или другой конструкции.

Этот подход заменяет `package objects` из Scala 2, которые впоследствии будут объявлены устаревшими и удалены. 
Но, будучи намного проще в использовании, они работают аналогично: 
когда вы помещаете определение в пакет с именем `foo`, 
вы можете получить доступ к этому определению во всех других пакетах в `foo`, например, в пакете `foo.bar` в этом примере:

```scala
package foo {
  def double(i: Int) = i * 2
}

package foo {
  package bar {
    @main def fooBarMain =
      println(s"${double(1)}")
  }
}
```

Фигурные скобки используются в этом примере, чтобы подчеркнуть вложенность пакета (они не обязательны для использования).

Преимуществом такого подхода является то, что можно размещать определения в пакете с именем `com.acme.myapp`, 
а затем можно ссылаться на эти определения в `com.acme.myapp.model`, `com.acme.myapp.controller` и т.д.

---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/dropped-features/package-objects.html)
