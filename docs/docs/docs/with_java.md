---
layout: docsplus
title: "Взаимодействие с Java"
section: scala
prev: tools/tools-worksheets
next: metaprogramming
---

## {{page.title}}

### Введение

В этом разделе рассматривается, как использовать код Java в Scala, и наоборот, как использовать код Scala в Java.

В целом, использование Java-кода в Scala довольно простое. 
Есть только несколько моментов использования утилит Scala для преобразования концепций Java в Scala, в том числе:
- классы коллекций Java
- Java класс `Optional`

Точно так же, если вы пишете код Java и хотите использовать концепции Scala, 
вам потребуется преобразовать коллекции Scala и Scala класс `Option`.

В следующих разделах показаны наиболее распространенные преобразования:
- как использовать коллекции Java в Scala
- как использовать Java `Optional` в Scala
- расширение интерфейсов Java в Scala
- как использовать коллекции Scala в Java
- как использовать Scala `Option` в Java
- как использовать Scala trait-ы в Java
- как обрабатывать методы Scala, которые в коде Java вызывают исключения
- как использовать Scala методы с переменным числом параметров в Java
- создание альтернативных имен для использования Scala методов в Java

Обратите внимание, что предпочтительно использование Java 11 или новее.

### Как использовать коллекции Java в Scala

Если при написании кода Scala необходимо использовать коллекцию Java, её можно использовать просто как есть. 
Однако, если необходимо использовать коллекцию в цикле `for` 
или желательно воспользоваться преимуществами функций высшего порядка в коллекциях Scala, 
потребуется преобразовать коллекцию Java в коллекцию Scala.

Вот пример того, как это работает. Учитывая этот Java `ArrayList`:

```java
// java
public class JavaClass {
  public static List<String> getStrings() {
    return new ArrayList<String>(List.of("a", "b", "c"));
  }
}
```

Можно преобразовать этот список Java в Scala `Seq`, 
используя утилиты преобразования в пакете Scala _scala.jdk.CollectionConverters_:

```java
// scala
import scala.jdk.CollectionConverters.*

def testList() =
  println("Using a Java List in Scala")
  val javaList: java.util.List[String] = JavaClass.getStrings()
  val scalaSeq: Seq[String] = javaList.asScala.toSeq
  scalaSeq.foreach(println)
  for s <- scalaSeq do println(s)
```

Конечно, этот код можно сократить, но здесь показаны отдельные шаги, 
чтобы продемонстрировать, как работает процесс преобразования.

### Как использовать Java `Optional` в Scala

Если нужно использовать Java класс `Optional` в коде Scala, импортируйте объект `scala.jdk.OptionConverters`, 
а затем используйте метод `toScala` для преобразования значения `Optional` в Scala `Option`.

Чтобы продемонстрировать это, вот класс Java с двумя значениями `Optional<String>`, 
одно из которых содержит строку, а второе — пустое:

```java
// java
import java.util.Optional;

public class JavaClass {
  static Optional<String> oString = Optional.of("foo");
  static Optional<String> oEmptyString = Optional.empty();
}
```

Теперь в коде Scala можно получить доступ к этим полям. 
Если просто получить к ним прямой доступ, они оба будут значениями `Optional`:

```scala
// scala
import java.util.Optional

val optionalString = JavaClass.oString         // Optional[foo]
val eOptionalString = JavaClass.oEmptyString   // Optional.empty
```

Но с помощью методов _scala.jdk.OptionConverters_ эти поля можно преобразовать в значения Scala `Option`:

```scala
import java.util.Optional
import scala.jdk.OptionConverters.*

val optionalString = JavaClass.oString         // Optional[foo]
val optionString = optionalString.toScala      // Some(foo)

val eOptionalString = JavaClass.oEmptyString   // Optional.empty
val eOptionString = eOptionalString.toScala    // None
```

### Расширение интерфейсов Java в Scala

Если необходимо использовать интерфейсы Java в коде Scala, расширяйте их так же, 
как если бы они были Scala trait-ами. Например, учитывая эти три интерфейса Java:

```java
// java
interface Animal {
  void speak();
}

interface Wagging {
  void wag();
}

interface Running {
  // an implemented method
  default void run() {
    System.out.println("I’m running");
  }
}
```

Можно создать класс `Dog` в Scala так же, как если бы использовались trait-ы. 
Все, что нужно сделать, это реализовать методы `speak` и `wag`:

```scala
// scala
class Dog extends Animal, Wagging, Running:
  def speak = println("Woof")
  def wag = println("Tail is wagging")

@main def useJavaInterfaceInScala =
  val d = new Dog
  d.speak
  d.wag
```

### Как использовать коллекции Scala в Java

Когда нужно использовать класс коллекции Scala в Java-коде, 
используйте методы Scala объекта `Scala.jdk.javaapi.CollectionConverters` в Java-коде, чтобы преобразования работали. 
Например, если есть подобный `List[String]` в классе Scala:

```scala
// scala
class ScalaClass:
  val strings = List("a", "b")
```

Можно получить доступ к этому списку Scala в коде Java следующим образом:

```java
// java
import scala.jdk.javaapi.CollectionConverters;

// create an instance of the Scala class
ScalaClass sc = new ScalaClass();

// access the `strings` field as `sc.strings()`
scala.collection.immutable.List<String> xs = sc.strings();

// convert the Scala `List` a Java `List<String>`
java.util.List<String> listOfStrings = CollectionConverters.asJava(xs);
listOfStrings.forEach(System.out::println);
```

Этот код можно сократить, но показаны полные шаги, чтобы продемонстрировать, как работает процесс. 
Вот несколько вещей, на которые стоит обратить внимание:
- в Java-коде создается экземпляр `ScalaClass` точно так же, как экземпляр класса Java.
- `ScalaClass` имеет поле с именем `strings`, 
но из Java вы получаете доступ к этому полю как к методу, т.е. как `sc.strings()`

### Как использовать Scala `Option` в Java

Когда нужно использовать Scala `Option` в коде Java, то можно преобразовать `Option` в значение Java `Optional`, 
используя метод `toJava` объекта Scala `scala.jdk.javaapi.OptionConverters`.

Чтобы продемонстрировать это, создайте класс Scala с двумя значениями `Option[String]`, 
одно из которых содержит строку, а второе — пустое:

```scala
// scala
object ScalaObject:
  val someString = Option("foo")
  val noneString: Option[String] = None
```

Затем в коде Java преобразуйте эти значения `Option[String]` в `java.util.Optional[String]` 
с помощью метода `toJava` из объекта `scala.jdk.javaapi.OptionConverters`:

```java
// java
import java.util.Optional;
import static scala.jdk.javaapi.OptionConverters.toJava;

public class JUseScalaOptionInJava {
  public static void main(String[] args) {
    Optional<String> stringSome = toJava(ScalaObject.someString());   // Optional[foo]
    Optional<String> stringNone = toJava(ScalaObject.noneString());   // Optional.empty
    System.out.printf("stringSome = %s\n", stringSome);
    System.out.printf("stringNone = %s\n", stringNone);
  }
}
```

Два поля Scala `Option` теперь доступны как `Optional` значения Java.

### Как использовать Scala trait-ы в Java

В Java 11 можно использовать trait Scala точно так же, как интерфейс Java, 
даже если у trait-а есть реализованные методы. 
Например, учитывая эти два trait-а Scala, один с реализованным методом и ещё один абстрактный:

```scala
// scala
trait ScalaAddTrait:
  def sum(x: Int, y: Int) =  x + y    // implemented

trait ScalaMultiplyTrait:
  def multiply(x: Int, y: Int): Int   // abstract
```

Класс Java может реализовать оба этих интерфейса и определить метод multiply:

```java
// java
class JavaMath implements ScalaAddTrait, ScalaMultiplyTrait {
  public int multiply(int a, int b) {
    return a * b;
  }
}

JavaMath jm = new JavaMath();
System.out.println(jm.sum(3,4));        // 7
System.out.println(jm.multiply(3,4));   // 12
```

### Как обрабатывать методы Scala, которые в коде Java вызывают исключения

Когда пишется Scala код, используя идиомы программирования Scala, 
вы никогда не напишете метод, который выдает исключение. 
Но если по какой-то причине есть метод Scala, который выдает исключение, 
и желательно, чтобы разработчики Java могли этот метод использовать, 
добавьте аннотацию `@throws` к этому методу Scala, 
чтобы пользователи Java знали, какие исключения он может выдавать.

Например, этот метод Scala `exceptionThrower` аннотирован, чтобы объявить, что он генерирует `Exception`:

```scala
// scala
object SExceptionThrower:
  @throws(classOf[Exception])
  def exceptionThrower = 
    throw new Exception("Idiomatic Scala methods don’t throw exceptions")
```

В результате нужно будет обработать исключение в Java-коде. 
Например, этот код не скомпилируется, потому что исключение не обрабатывается:

```java
// java: won’t compile because the exception isn’t handled
public class ScalaExceptionsInJava {
  public static void main(String[] args) {
    SExceptionThrower.exceptionThrower();
  }
}
```

Компилятор выдает ошибку:

```
[error] ScalaExceptionsInJava: unreported exception java.lang.Exception;
        must be caught or declared to be thrown
[error] SExceptionThrower.exceptionThrower()
```

Аннотация сообщает компилятору Java, что `exceptionThrower` может выдавать исключение. 
Теперь, при написании Java-кода, вы должны обработать исключение с помощью блока `try` 
или объявить, что Java-метод выдает исключение.

И наоборот, если оставить аннотацию вне метода Scala `exceptionThrower`, код Java будет скомпилирован. 
Но это не то, что следует делать, потому что код Java может не учитывать метод Scala, вызывающий исключение.

### Как использовать Scala методы с переменным числом параметров в Java

Если метод Scala имеет переменное число параметров и необходимо использовать этот метод в Java, 
то данный метод Scala помечается аннотацией `@varargs`. 
Например, метод `printAll` в этом классе Scala объявляет поле `String*` `varargs`:

```scala
// scala
import scala.annotation.varargs

object VarargsPrinter:
  @varargs def printAll(args: String*): Unit = args.foreach(println)
```

Поскольку `printAll` объявлен с аннотацией `@varargs`, 
его можно вызвать из программы Java с переменным числом параметров, как показано в этом примере:

```java
// java
public class JVarargs {
  public static void main(String[] args) {
    VarargsPrinter.printAll("Hello", "world");
  }
}
```

Запуск этого кода приводит к следующему выводу:

```
Hello
world
```

### Создание альтернативных имен для использования Scala методов в Java

В Scala можно создавать методы с символическими именами, например, `+`:

```scala
def +(a: Int, b: Int) = a + b
```

Это имя метода не будет работать в Java, 
но в Scala можно указать "альтернативное" имя для метода — псевдоним, который будет работать в Java:

```java
import scala.annotation.targetName

class Adder:
  @targetName("add") def +(a: Int, b: Int) = a + b
```

Теперь в Java-коде можно использовать псевдоним имени метода `add`:

```java
var adder = new Adder();
int x = adder.add(1,1);
System.out.printf("x = %d\n", x);
```


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/interacting-with-java.html)
- [Scala 3 Reference](https://docs.scala-lang.org/scala3/reference/other-new-features/targetName.html)
