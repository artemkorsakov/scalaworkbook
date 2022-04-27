---
layout: docs
title: "Сборка и тестирование проектов Scala с помощью Sbt"
---

## {{page.title}}

В этом разделе будут показаны два инструмента, которые обычно используются в проектах Scala:
- инструмент сборки [**sbt**][Sbt]
- [**ScalaTest**][ScalaTest] - среда тестирования исходного кода

Начнем с использования **sbt** для создания Scala-проектов, 
а затем рассмотрим, как использовать **sbt** и **ScalaTest** вместе для тестирования.


### Создание проектов Scala с помощью sbt

Можно использовать несколько различных инструментов для создания проектов Scala, 
включая Ant, Maven, Gradle, Mill и другие. 
Но инструмент под названием **sbt** был первым инструментом сборки, специально созданным для Scala.

> Чтобы установить sbt, см. [страницу загрузки sbt][Sbt download].

#### Создание проекта "Hello, world"

Вы можете создать проект sbt "Hello, world" всего за несколько шагов. 
Сначала создайте каталог для работы и перейдите в него:

```
$ mkdir hello
$ cd hello
```

В каталоге _hello_ создайте подкаталог `project`:

```
$ mkdir project
```

Создайте файл с именем _build.properties_ в каталоге `project` со следующим содержимым:

```
sbt.version=1.6.1
```

Затем создайте файл с именем _build.sbt_ в корневом каталоге проекта (`hello`), содержащий следующую строку:

```
scalaVersion := "@SCALA@"
```

Теперь создайте файл с именем _Hello.scala_ в корневом каталоге проекта с таким содержимым:

```scala
@main def helloWorld = println("Hello, world")
```

Это все, что нужно сделать.

Должна получиться следующая структура проекта:

```
$ tree
.
├── build.sbt
├── Hello.scala
└── project
    └── build.properties
```

Теперь запустите проект с помощью команды sbt:

```sbt
$ sbt run
```

Вы должны увидеть вывод, который выглядит следующим образом, включая "Hello, world" из программы:

```
$ sbt run
[info] welcome to sbt 1.6.1 (AdoptOpenJDK Java 11.x)
[info] loading project definition from project ...
[info] loading settings for project from build.sbt ...
[info] compiling 1 Scala source to target/scala-3.1.2/classes ...
[info] running helloWorld
Hello, world
[success] Total time: 2 s
```






---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/tools-sbt.html)

[Sbt]: https://www.scala-sbt.org/
[Sbt download]: https://www.scala-sbt.org/download.html
[ScalaTest]: https://www.scalatest.org/
