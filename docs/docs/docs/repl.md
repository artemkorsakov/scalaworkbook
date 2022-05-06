---
layout: docsplus
title: "Read-Evaluate-Print-Loop"
prev: hello_world
next: types
---

## {{page.title}}

Scala REPL ("Read-Evaluate-Print-Loop") - это интерпретатор командной строки, 
который используется в качестве "игровой площадки" для тестирования Scala кода. 
Для того чтобы запустить сеанс REPL, надо выполнить команду `scala` или `scala3` 
в зависимости от операционной системы, 
где будет выведено приглашение "Welcome", подобное этому:

```
$ scala
Welcome to Scala @SCALA@ (OpenJDK 64-Bit Server VM, Java 11.0.9).
Type in expressions for evaluation.
Or try :help.

scala> _
```

REPL — это интерпретатор командной строки, поэтому он ждет, пока вы что-нибудь наберете. 
Теперь можно вводить выражения Scala, чтобы увидеть, как они работают:

```
scala> 1 + 1
val res0: Int = 2

scala> 2 + 2
val res1: Int = 4
```

Как показано в выводе, если не присваивать переменную результату выражения, 
REPL автоматически создает переменные с именами `res0`, `res1` и т. д. 
Эти имена переменных можно использовать в последующих выражениях:

```
scala> val x = res0 * 10
val x: Int = 20
```

Обратите внимание, что в REPL output также показываются результаты выражений.

В REPL можно проводить всевозможные эксперименты. В этом примере показано, как создать, а затем вызвать метод `sum`:

```
scala> def sum(a: Int, b: Int): Int = a + b
def sum(a: Int, b: Int): Int

scala> sum(2, 2)
val res2: Int = 4
```

Также можно использовать игровую среду на основе браузера [scastie.scala-lang.org](https://scastie.scala-lang.org/).

Если вы предпочитаете писать код в текстовом редакторе, а не в консоли, 
то можно использовать [worksheet](./tools/tools-worksheets).


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-repl.html)
