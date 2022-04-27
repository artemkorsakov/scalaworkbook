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

Программа запуска sbt — средство командной строки `sbt` - загружает версию sbt, 
установленную в файле _project/build.properties_, которая загружает версию компилятора Scala, 
установленную в файле _build.sbt_, компилирует код в файле _Hello.scala_ и запускает результирующий байт—код.

Если посмотреть на свой каталог, то можно увидеть, что появился каталог с именем _target_. 
Это рабочие каталоги, которые использует sbt.

Создание и запуск небольшого проекта Scala с помощью sbt занимает всего несколько простых шагов.

#### Использование sbt в более крупных проектах

Для небольшого проекта это все, что требует sbt для запуска. 
Для более крупных проектов с большим количеством файлов исходного кода, зависимостей или плагинов, 
потребуется создать организованную структуру каталогов. 
Остальная часть этого раздела демонстрирует структуру, которую использует sbt.

#### Структура каталогов sbt

Как и Maven, sbt использует стандартную структуру каталогов проекта. 
Преимуществом стандартизации является то, что, как только структура станет привычной, 
будет легко работать с другими проектами Scala/sbt.

Первое, что нужно знать - это то, что под корневым каталогом проекта 
sbt ожидает структуру каталогов, которая выглядит следующим образом:

```
.
├── build.sbt
├── project/
│   └── build.properties
├── src/
│   ├── main/
│   │   ├── java/
│   │   ├── resources/
│   │   └── scala/
│   └── test/
│       ├── java/
│       ├── resources/
│       └── scala/
└── target/
```

Также в корневой каталог можно добавить каталог _lib_, 
если необходимо в свой проект добавить неуправляемые зависимости — файлы JAR.

Если достаточно создать проект, который имеет только файлы исходного кода Scala и тесты, 
но не будет использовать Java файлы 
и не нуждается в каких-либо "ресурсах" (встроенные изображения, файлы конфигурации и т.д.),
то в каталоге `src` можно оставить только:

```
.
└── src/
    ├── main/
    │   └── scala/
    └── test/
        └── scala/
```

#### "Hello, world" со структурой каталогов sbt

Создать такую структуру каталогов просто. 
Существуют инструменты, которые сделают это за вас, но если вы используете систему Unix/Linux, 
можно использовать следующие команды для создания структуры каталогов проекта sbt:

```
$ mkdir HelloWorld
$ cd HelloWorld
$ mkdir -p src/{main,test}/scala
$ mkdir project target
```

После запуска этих команд, по запросу `find .` вы должны увидеть такой результат:

```
$ find .
.
./project
./src
./src/main
./src/main/scala
./src/test
./src/test/scala
./target
```

> Существуют и другие способы создания файлов и каталогов для проекта sbt. 
> Один из способов - использовать команду `sbt new`, которая задокументирована на [scala-sbt.org][Sbt]. 

#### Создание первого файла build.sbt

На данный момент нужны еще две вещи для запуска проекта "Hello, world":
- файл _build.sbt_
- файл _Hello.scala_

Для такого небольшого проекта файлу _build.sbt_ нужна только запись `scalaVersion`, 
но мы добавим три строки:

```
name := "HelloWorld"
version := "0.1"
scalaVersion := "@SCALA@"
```

Поскольку проекты sbt используют стандартную структуру каталогов, sbt может найти все, что ему нужно. 

Теперь вам просто нужно добавить небольшую программу "Hello, world".

#### Программа "Hello, world"

В больших проектах все файлы исходного кода будут находиться в каталогах _src/main/scala_ и _src/test/scala_, 
но для небольшого примера, подобного этому, можно поместить файл исходного кода в корневой каталог.
Поэтому создайте файл с именем _HelloWorld.scala_ в корневом каталоге со следующим содержимым:

```scala
@main def helloWorld = println("Hello, world")
```

Этот код определяет "main" метод, который печатает `"Hello, world"` при запуске.

Теперь используйте команду `sbt run` для компиляции и запуска проекта:

```
$ sbt run

[info] welcome to sbt
[info] loading settings for project ...
[info] loading project definition
[info] loading settings for project root from build.sbt ...
[info] Compiling 1 Scala source ...
[info] running helloWorld 
Hello, world
[success] Total time: 4 s
```

При первом запуске sbt загружает все, что ему нужно (это может занять несколько секунд), 
но после первого раза запуск становится намного быстрее.

Кроме того, после выполнения первого шага можно обнаружить, что гораздо быстрее запускать sbt в интерактивном режиме. 
Для этого вначале отдельно запустите команду `sbt`:

```
$ sbt

[info] welcome to sbt
[info] loading settings for project ...
[info] loading project definition ...
[info] loading settings for project root from build.sbt ...
[info] sbt server started at
       local:///${HOME}/.sbt/1.0/server/7d26bae822c36a31071c/sock
sbt:hello-world> _
```

Затем внутри этой оболочки выполните команду `run`:

```
sbt:hello-world> run

[info] running helloWorld 
Hello, world
[success] Total time: 0 s
```

Так намного быстрее.

Если вы наберете `help` в командной строке sbt, то увидите список других команд, которые можно запустить. 
А пока просто введите `exit` (или нажмите `CTRL-D`), чтобы выйти из оболочки sbt.

#### Использование шаблонов проектов

Ручное создание структуры проекта может быть утомительным. 
К счастью, sbt может создать структуру на основе шаблона.

Чтобы создать проект Scala 3 из шаблона, выполните следующую команду в оболочке:

```
$ sbt new scala/scala3.g8
```

Sbt загрузит шаблон, задаст несколько вопросов и создаст файлы проекта в подкаталоге:

```
$ tree scala-3-project-template 
scala-3-project-template
├── build.sbt
├── project
│   └── build.properties
├── README.md
└── src
    ├── main
    │   └── scala
    │       └── Main.scala
    └── test
        └── scala
            └── Test1.scala
```

> Если вы хотите создать проект Scala 3, который кросс-компилируется со Scala 2, используйте шаблон `scala/scala3-cross.g8`:
> ```
> $ sbt new scala/scala3-cross.g8
> ```

Узнайте больше о `sbt new` и шаблонах проектов в 
[документации sbt](https://www.scala-sbt.org/1.x/docs/sbt-new-and-Templates.html#sbt+new+and+Templates).

#### Другие инструменты сборки для Scala

???




---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/tools-sbt.html)

[Sbt]: https://www.scala-sbt.org/
[Sbt download]: https://www.scala-sbt.org/download.html
[ScalaTest]: https://www.scalatest.org/
