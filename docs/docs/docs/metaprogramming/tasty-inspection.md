---
layout: docsplus
title: "TASTy Inspection"
section: scala
prev: metaprogramming/reflection
next: soft-keywords
---

## {{page.title}}

```sbt
libraryDependencies += "org.scala-lang" %% "scala3-tasty-inspector" % scalaVersion.value
```

TASTy файлы содержат полное типизированное дерево класса, включая исходные позиции и документацию. 
Это идеально подходит для инструментов, которые анализируют или извлекают семантическую информацию из кода. 
Чтобы избежать хлопот при работе напрямую с TASTy файлом, 
предоставляется файл `Inspector`, который загружает содержимое и предоставляет его через TASTy reflect API.


### Проверка TASTy файлов

Для просмотра деревьев TASTy файла потребитель может быть определен следующим образом.

```scala
import scala.quoted.*
import scala.tasty.inspector.*

class MyInspector extends Inspector:
   def inspect(using Quotes)(tastys: List[Tasty[quotes.type]]): Unit =
      import quotes.reflect.*
      for tasty <- tastys do
         val tree = tasty.ast
         // Do something with the tree
```

Затем можно создать экземпляр потребителя с помощью следующего кода, чтобы получить дерево файла `foo/Bar.tasty`.

```scala
object Test:
   def main(args: Array[String]): Unit =
      val tastyFiles = List("foo/Bar.tasty")
      TastyInspector.inspectTastyFiles(tastyFiles)(new MyInspector)
```

Обратите внимание, что если нужно запустить `main` 
(в приведенном ниже примере, определенном в объекте с именем `Test`) после компиляции,
нужно сделать компилятор доступным для среды выполнения:

```
scalac -d out Test.scala
scala -with-compiler -classpath out Test
```

### Шаблон проекта

Используя версию `sbt 1.1.5+`, выполните:

```sbt
sbt new scala/scala3-tasty-inspector.g8
```

в папке, куда вы хотите клонировать шаблон.


---

**References:**
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/metaprogramming/tasty-inspect.html)
