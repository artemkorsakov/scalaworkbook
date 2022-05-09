---
layout: docsplus
title: "main методы"
prev: methods/method-features
next: functions
---

## {{page.title}}

Scala предлагает следующий способ определения программ, которые можно вызывать из командной строки: 
добавление аннотации `@main` к методу превращает его в точку входа исполняемой программы:

```scala
@main def hello() = println("Hello, world")
```

Достаточно сохранить эту строку кода в файле с именем, например, `Hello.scala`
(имя файла необязательно должно совпадать с именем метода) 
и скомпилировать его с помощью `scalac`:

```scala
$ scalac Hello.scala
```

Затем запустить с помощью `scala`:

```scala
$ scala hello
Hello, world
```

Аннотированный метод `@main` может быть написан либо на верхнем уровне (как показано), 
либо внутри статически доступного объекта. 
В любом случае имя программы - это имя метода без каких-либо префиксов объектов.

#### Аргументы командной строки

Метод `@main` может обрабатывать аргументы командной строки с разными типами. 
Например, данный метод `@main`, который принимает параметры `Int`, `String` и дополнительные строковые параметры:

```scala
@main def happyBirthday(age: Int, name: String, others: String*) =
  val suffix = (age % 100) match
    case 11 | 12 | 13 => "th"
    case _ => (age % 10) match
      case 1 => "st"
      case 2 => "nd"
      case 3 => "rd"
      case _ => "th"

  val sb = StringBuilder(s"Happy $age$suffix birthday, $name")
  for other <- others do sb.append(" and ").append(other)
  sb.toString
```

После компиляции кода создается основная программа с именем `happyBirthday`, которая вызывается следующим образом:

```scala
$ scala happyBirthday 23 Lisa Peter
Happy 23rd Birthday, Lisa and Peter!
```

Как показано, метод `@main` может иметь произвольное количество параметров. 
Для каждого типа параметра должен быть экземпляр _scala.util.FromString_, 
который преобразует аргумент из `String` в требуемый тип параметра. 
Также, как показано, список параметров основного метода может заканчиваться повторяющимся параметром типа `String*`, 
который принимает все оставшиеся аргументы, указанные в командной строке.

Программа, реализованная с помощью метода `@main`, проверяет, 
что в командной строке достаточно аргументов для заполнения всех параметров, 
и что строки аргументов могут быть преобразованы в требуемые типы. 
Если проверка завершается неудачей, программа завершается с сообщением об ошибке:

```scala
$ scala happyBirthday 22
Illegal command line after first argument: more arguments expected

$ scala happyBirthday sixty Fred
Illegal command line: java.lang.NumberFormatException: For input string: "sixty"
```

### Детали

Компилятор Scala генерирует программу из `@main` метода `f` следующим образом:
- он создает класс с именем `f` в пакете, где был найден метод `@main`.
- класс имеет статический метод `main` с обычной сигнатурой Java `main` метода: 
принимает `Array[String]` в качестве аргумента и возвращает `Unit`.
- сгенерированный `main` метод вызывает метод `f` с аргументами, 
преобразованными с помощью методов в объекте `scala.util.CommandLineParser`.

Например, приведенный выше метод `happyBirthday` генерирует дополнительный код, эквивалентный следующему классу:

```scala
final class happyBirthday {
  import scala.util.{CommandLineParser as CLP}
  <static> def main(args: Array[String]): Unit =
    try
      happyBirthday(
          CLP.parseArgument[Int](args, 0),
          CLP.parseArgument[String](args, 1),
          CLP.parseRemainingArguments[String](args, 2))
    catch {
      case error: CLP.ParseError => CLP.showError(error)
    }
}
```

> Примечание: В этом сгенерированном коде модификатор `<static>` выражает, 
> что `main` метод генерируется как статический метод класса `happyBirthday`. 
> Эта функция недоступна для пользовательских программ в Scala. 
> Вместо неё обычные "статические" члены генерируются в Scala с использованием `object`.

> @main методы — это рекомендуемый способ создания программ, вызываемых из командной строки в Scala 3. 
> Они заменяют [предыдущий подход](https://docs.scala-lang.org/scala3/book/methods-main-methods.html#scala-3-compared-to-scala-2), 
> который заключался в создании объекта, расширяющего класс App.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/taste-methods.html)
- [Scala3 book, main Methods](https://docs.scala-lang.org/scala3/book/methods-main-methods.html)

