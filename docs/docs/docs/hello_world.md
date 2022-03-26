---
layout: docs
title: "Hello, world!"
---

## {{page.title}}

Пример Scala "Hello, world!" выглядит следующим образом. 
Сначала поместите этот код в файл с именем `Hello.scala`:

```scala
@main def hello = println("Hello, world!")
```

В этом коде `hello` - это метод. Он определен с помощью `def` и объявлен как метод "main" с аннотацией `@main`. 
Он выводит строку "Hello, world!" в стандартный вывод (STDOUT) с использованием метода `println`.

Затем скомпилируйте код с помощью scalac:
```
> scalac Hello.scala
```

Метод `hello` компилится в отдельный класс на уровне пакета с именем класса равным имени метода.
В один файл можно добавлять несколько main методов с различными именами.

---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-hello-world.html)
