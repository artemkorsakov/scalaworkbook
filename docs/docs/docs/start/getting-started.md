---
layout: docsplus
title: "С чего начать?"
prev: index
next: hello_world
---

## {{page.title}}

### Scala без предварительной установки

Чтобы сразу начать экспериментировать со Scala, используйте ["Scastie" в своем браузере](https://scastie.scala-lang.org/pEBYc5VMT02wAGaDrfLnyw). 
Scastie — это онлайн-площадка, где можно поэкспериментировать с примерами Scala, 
чтобы увидеть, как все работает, с доступом ко всем компиляторам Scala и опубликованным библиотекам.

> Scastie поддерживает как Scala 3, так и Scala 2, но по умолчанию используется Scala 3.

### Установка Scala на компьютер

Установка Scala означает установку различных инструментов командной строки, 
таких как компилятор Scala и инструменты сборки. 
Рекомендуется использовать инструмент установки "Coursier", 
который автоматически устанавливает все зависимости, 
но также возможно каждый инструмент установить по отдельности вручную.

#### Использование Scala Installer (рекомендованный путь)

Установщик Scala — это инструмент [Coursier](https://get-coursier.io/docs/cli-overview), 
основная команда которого называется `cs`. 
Он гарантирует, что в системе установлены JVM и стандартные инструменты Scala. 
Установите его в своей системе, [следуя следующим инструкциям](https://get-coursier.io/docs/cli-installation).

Наряду с JVM программа установки `cs` также устанавливает полезные инструменты командной строки:
- JDK (если его еще нет)
- Инструмент сборки [sbt](https://www.scala-sbt.org/)
- [Ammonite](https://ammonite.io/), улучшенный REPL
- [scalafmt](https://scalameta.org/scalafmt/), средство форматирования кода Scala
- `scalac` (компилятор Scala)
- `scala` (Scala REPL и средство запуска сценариев)

Дополнительная информация о `cs` [доступна по ссылке](https://get-coursier.io/docs/cli-overview).

#### ...или вручную

Для компиляции, запуска, тестирования и упаковки проекта Scala нужны только два инструмента: Java 8 или 11 и sbt. 
Чтобы установить их вручную:
- если не установлена Java 8 или 11, загрузите Java из 
[Oracle Java 8](https://www.oracle.com/java/technologies/downloads/#java8), 
[Oracle Java 11](https://www.oracle.com/java/technologies/downloads/#java11) 
или [AdoptOpenJDK 8/11](https://adoptopenjdk.net/).
Подробную информацию о совместимости Scala/Java см. в разделе 
[Совместимость с JDK](https://docs.scala-lang.org/overviews/jdk-compatibility/overview.html).
- установить [sbt](https://www.scala-sbt.org/download.html)

### Создание проекта "Hello World" с помощью sbt

Для создания проекта можно использовать командную строку или IDE. 

#### Использование командной строки

sbt — это инструмент сборки для Scala. 
sbt компилирует, запускает и тестирует Scala код 
(Он также может публиковать библиотеки и выполнять множество других задач).

Чтобы создать новый проект Scala с помощью sbt:
1. `cd` в пустую папку.
2. Запустите команду `sbt new scala/scala3.g8`, чтобы создать проект Scala 3. 
Она извлекает шаблон проекта из GitHub, а также создаёт папку `target`.
3. При появлении запроса назовите приложение `hello-world`. Это создаст проект под этим названием.
4. Будет сгенерировано следующее:

```
- hello-world
    - project (sbt использует эту папку для собственных файлов)
        - build.properties
    - build.sbt (sbt's build definition file)
    - src
        - main
            - scala (здесь весь Scala code)
                - Main.scala (Точка входа в программу) <-- это все, что сейчас нужно
```

Дополнительную документацию по sbt можно найти в [соответствующей главе](../tools/tools-sbt) 
и в [официальной документации sbt](https://www.scala-sbt.org/1.x/docs/index.html).

### Открытие проекта в IDE

Для открытия проекта желательно использовать IDE. Самые популярные из них — IntelliJ и VSCode. 
Оба предлагают богатые возможности, 
но также можно использовать [множество других редакторов](https://scalameta.org/metals/docs/).

#### Использование IntelliJ

1. Загрузите и установите [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/).
2. Установите plugin Scala, следуя [инструкциям по установке](https://www.jetbrains.com/help/idea/managing-plugins.html).
3. Откройте файл `build.sbt`, затем выберите _Open as a project_.

#### Использование VSCode с metals

1. Скачайте [VSCode](https://code.visualstudio.com/Download).
2. Установите расширение Metals из [Marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals).
3. Затем откройте каталог, содержащий файл `build.sbt` (это должен быть каталог `hello-world`). 
Когда будет предложено, выберите _Import build_.

> [Metals](https://scalameta.org/metals/) — это "языковой сервер Scala", 
> обеспечивающий поддержку написания кода Scala в VS Code и других редакторах, 
> таких как [Atom, Sublime Text и других](https://scalameta.org/metals/docs/), 
> с использованием протокола Language Server. 
> 
> Под капотом Metals взаимодействует со средством сборки 
> с помощью [ Build Server Protocol (BSP)](https://build-server-protocol.github.io/). 
> Подробнее о том, как работает Metals, см. 
> ["Написание Scala в VS Code, Vim, Emacs, Atom и Sublime Text с помощью Metals"](https://www.scala-lang.org/2019/04/16/metals.html).

#### Исходный код

Просмотрите эти два файла в своей IDE:
- _build.sbt_
- _src/main/scala/Main.scala_

При запуске проекта на следующем шаге, конфигурация в _build.sbt_ 
будет использована для запуска кода в _src/main/scala/Main.scala_.

### Запуск Hello World

Код в `Main.scala` можно запускать из IDE, если удобно.

Но также можно запустить приложение из терминала, выполнив следующие действия:
1. `cd` в `hello-world`.
2. Запустить `sbt`. Эта команда открывает sbt-консоль.
3. В консоле введите `~run`. `~` является необязательным, 
но заставляет sbt повторно запускаться при каждом сохранении файла, 
обеспечивая быстрый цикл редактирования/запуска/отладки. 
sbt также создаст директорию `target`, которую пока можно игнорировать.

После окончания экспериментирования с проектом, нажмите `[Enter]`, чтобы прервать команду `run`. 
Затем введите `exit` или нажмите `[Ctrl+D]`, чтобы выйти из sbt и вернуться в командную строку.


---

**References:**
- [Scala, Getting started](https://docs.scala-lang.org/scala3/getting-started.html)
