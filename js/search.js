// When the user clicks on the search box, we want to toggle the search dropdown
function displayToggleSearch(e) {
  e.preventDefault();
  e.stopPropagation();

  closeDropdownSearch(e);
  
  if (idx === null) {
    console.log("Building search index...");
    prepareIdxAndDocMap();
    console.log("Search index built.");
  }
  const dropdown = document.querySelector("#search-dropdown-content");
  if (dropdown) {
    if (!dropdown.classList.contains("show")) {
      dropdown.classList.add("show");
    }
    document.addEventListener("click", closeDropdownSearch);
    document.addEventListener("keydown", searchOnKeyDown);
    document.addEventListener("keyup", searchOnKeyUp);
  }
}

//We want to prepare the index only after clicking the search bar
var idx = null
const docMap = new Map()

function prepareIdxAndDocMap() {
  const docs = [  
    {
      "title": "Контекстуальные абстракции",
      "url": "/scalaworkbook/docs/abstractions.html",
      "content": "Контекстуальные абстракции При определенных обстоятельствах можно опустить некоторые параметры вызовов методов, которые считаются повторяющимися. Эти параметры называются параметрами контекста (Context Parameters), поскольку они выводятся компилятором из контекста, окружающего вызов метода. Например, рассмотрим программу, которая сортирует список адресов по двум критериям: название города, а затем - название улицы. val addresses: List[Address] = ... addresses.sortBy(address =&gt; (address.city, address.street)) Метод sortBy принимает функцию, которая возвращает для каждого адреса значение для сравнения его с другими адресами. В этом случае мы передаем функцию, которая возвращает пару, содержащую название города и название улицы. Обратите внимание, что мы указываем только, что сравнивать, но не как выполнять сравнение. Как алгоритм сортировки узнает, как сравнивать пары строк? На самом деле метод sortBy принимает второй параметр — параметр контекста, который выводится компилятором. Параметр не появляется в приведенном выше примере, потому что он предоставляется компилятором. Этот второй параметр реализует способ сравнения. Удобно опустить его, потому что мы знаем, что строки обычно сравниваются с использованием лексикографического порядка. Однако также возможно передать его явно: addresses.sortBy(address =&gt; (address.city, address.street))(using Ordering.Tuple2(Ordering.String, Ordering.String)) В данном случае экземпляр Ordering.Tuple2(Ordering.String, Ordering.String) - это именно тот экземпляр, который выводится компилятором в первом случае. Другими словами, оба примера используют одну и ту же функцию сравнения. Контекстуальные абстракции используются для того, чтобы избежать повторения кода. Они помогают разработчикам писать фрагменты кода, которые являются расширяемыми и в то же время краткими. References: Scala3 book"
    } ,    
    {
      "title": "Коллекции",
      "url": "/scalaworkbook/docs/collections.html",
      "content": "Коллекции Библиотека Scala имеет богатый набор классов коллекций, и эти классы имеют разнообразный набор методов. Классы коллекций доступны как в неизменяемой, так и в изменяемой формах. Создание списка Вот несколько примеров, в которых используется класс List, который является неизменяемым классом связанного списка. В этих примерах показаны различные способы создания заполненного списка: List(1, 2, 3) // res0: List[Int] = List(1, 2, 3) (1 to 5).toList // res1: List[Int] = List(1, 2, 3, 4, 5) (1 to 10 by 2).toList // res2: List[Int] = List(1, 3, 5, 7, 9) (1 until 5).toList // res3: List[Int] = List(1, 2, 3, 4) List.range(1, 5) // res4: List[Int] = List(1, 2, 3, 4) List.range(1, 10, 3) // res5: List[Int] = List(1, 4, 7) Методы List-а В следующих примерах показаны некоторые методы, которые можно вызвать для List. Все методы функциональные - это означает, что они не изменяют коллекцию, для которой вызываются, а вместо этого возвращают новую коллекцию с обновленными элементами. val a = List(10, 20, 30, 40, 10) // a: List[Int] = List(10, 20, 30, 40, 10) a.drop(2) // res6: List[Int] = List(30, 40, 10) a.dropWhile(_ &lt; 25) // res7: List[Int] = List(30, 40, 10) a.filter(_ &lt; 25) // res8: List[Int] = List(10, 20, 10) a.slice(2,4) // res9: List[Int] = List(30, 40) a.tail // res10: List[Int] = List(20, 30, 40, 10) a.take(3) // res11: List[Int] = List(10, 20, 30) a.takeWhile(_ &lt; 30) // res12: List[Int] = List(10, 20) val b = List(List(1,2), List(3,4)) // b: List[List[Int]] = List(List(1, 2), List(3, 4)) b.flatten // res13: List[Int] = List(1, 2, 3, 4) val nums = List(\"one\", \"two\") // nums: List[String] = List(\"one\", \"two\") nums.map(_.toUpperCase) // res14: List[String] = List(\"ONE\", \"TWO\") nums.flatMap(_.toUpperCase) // res15: List[Char] = List('O', 'N', 'E', 'T', 'W', 'O') Эти примеры показывают, как методы foldLeft и reduceLeft используются для суммирования значений в последовательности целых чисел: val firstTen = (1 to 10).toList // firstTen: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10) firstTen.reduceLeft(_ + _) // res16: Int = 55 firstTen.foldLeft(100)(_ + _) // 100 - начальное значение // res17: Int = 155 Описание всех методов классов коллекции можно найти в API документации. Кортежи Scala tuple - это тип, который позволяет помещать коллекцию разных типов в один и тот же контейнер. Например, учитывая case class Person: case class Person(name: String) можно построить кортеж, содержащий Int, String и Person: val t = (11, \"eleven\", Person(\"Eleven\")) // t: Tuple3[Int, String, Person] = (11, \"eleven\", Person(name = \"Eleven\")) Доступ к значениям кортежа осуществляется через индекс (начиная с 0): t(0) // res18: Int = 11 t(1) // res19: String = \"eleven\" t(2) // res20: Person = Person(name = \"Eleven\") либо через методы вида ._i, где i - порядковый номер (начиная с 1, в отличие от индекса) t._1 // res21: Int = 11 t._2 // res22: String = \"eleven\" t._3 // res23: Person = Person(name = \"Eleven\") Также можно использовать extractor для присвоения переменным значений полей кортежа: val (num, str, person) = t // num: Int = 11 // str: String = \"eleven\" // person: Person = Person(name = \"Eleven\") Кортежи хороши для случаев, когда необходимо поместить коллекцию разнородных типов в небольшую структуру, похожую на коллекцию. References: Scala3 book"
    } ,    
    {
      "title": "Функции первого класса",
      "url": "/scalaworkbook/docs/functions.html",
      "content": "Функции первого класса Scala обладает большинством возможностей, ожидаемых от функционального языка программирования, включая: Лямбды (анонимные функции) Функции высшего порядка (HOFs) Неизменяемые коллекции в стандартной библиотеке Лямбды, также известные как анонимные функции, играют важную роль в том, чтобы код был кратким, но читабельным. Эти два примера эквивалентны и показывают, как умножить каждое число в списке на 2, передав лямбду в метод map: List(1, 2, 3).map(i =&gt; i * 2) // res0: List[Int] = List(2, 4, 6) List(1, 2, 3).map(_ * 2) // res1: List[Int] = List(2, 4, 6) Метод map класса List является типичным примером функции более высокого порядка - функции, которая принимает функцию в качестве параметра. Эти примеры также эквивалентны следующему коду, который использует метод double вместо лямбда: def double(i: Int): Int = i * 2 List(1, 2, 3).map(i =&gt; double(i)) // res2: List[Int] = List(2, 4, 6) List(1, 2, 3).map(double) // res3: List[Int] = List(2, 4, 6) Неизменяемые коллекции В процессе работы с неизменяемыми коллекциями, такими как List, Vector и неизменяемыми классами Map и Set, важно помнить, что их функции не изменяют коллекцию, для которой они вызываются; вместо этого они возвращают новую коллекцию с обновленными данными. В результате принято связывать их вместе в “fluent” стиле для решения проблем. В этом примере показано, как дважды отфильтровать коллекцию, а затем умножить каждый элемент в оставшейся коллекции: val nums = (1 to 10).toList // nums: List[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10) val x = nums.filter(_ &gt; 3) .filter(_ &lt; 7) .map(_ * 10) // x: List[Int] = List(40, 50, 60) P.S. Пример призван показать только то, как принято последовательно вызывать функции на неизменяемых коллекциях. Его недостаток в том, что обход коллекции происходит целых три раза. Чтобы получить аналогичный результат за единичный обход коллекции, достаточно: nums.withFilter(n =&gt; 3 &lt; n &amp;&amp; n &lt; 7).map(_ * 10) References: Scala3 book"
    } ,    
    {
      "title": "Hello, world!",
      "url": "/scalaworkbook/docs/hello_world.html",
      "content": "Hello, world! Пример Scala “Hello, world!” выглядит следующим образом. Сначала поместите этот код в файл с именем Hello.scala: @main def hello = println(\"Hello, world!\") В этом коде hello - это метод. Он определен с помощью def и объявлен как метод “main” с аннотацией @main. Он выводит строку “Hello, world!” в стандартный вывод (STDOUT) с использованием метода println. Затем скомпилируйте код с помощью scalac: &gt; scalac Hello.scala Метод hello компилится в отдельный класс на уровне пакета с именем класса равным имени метода. В один файл можно добавлять несколько main методов с различными именами. References: Scala3 book"
    } ,    
    {
      "title": "Обзор Scala",
      "url": "/scalaworkbook/docs/",
      "content": "Обзор Scala Цель этой документации - дать неофициальное описание языка Scala на русском языке. В ней относительно легко затрагиваются все темы Scala. Для получения дополнительной информации об описываемой теме внизу страницы даны ссылки на справочную документацию, в которой более подробно рассматриваются многие функции языка Scala. Scala - это красивый, выразительный язык программирования с чистым, современным синтаксисом, который обеспечивает безопасную систему статических типов. Он поддерживает как функциональное программирование, так и объектно-ориентированное программирование. Особенности Scala 3 References: Scala3 book"
    } ,    
    {
      "title": "Основная",
      "url": "/scalaworkbook/",
      "content": "Основная Описание В этой рабочей тетради изложены основные принципы функциональной разработки на Scala, в том числе с помощью популярных фреймворков. Код написан на версии Scala - 3.1.1. Документация Обзор Scala"
    } ,    
    {
      "title": "Методы",
      "url": "/scalaworkbook/docs/methods.html",
      "content": "Методы Scala classes, case classes, traits, enums, и objects могут содержать методы. Синтаксис простого метода выглядит следующим образом: def methodName(param1: Type1, param2: Type2): ReturnType = // здесь тело метода Несколько примеров: def sum(a: Int, b: Int): Int = a + b def concatenate(s1: String, s2: String): String = s1 + s2 sum(1, 2) // res0: Int = 3 concatenate(\"foo\", \"bar\") // res1: String = \"foobar\" В параметрах методов можно указывать дефолтные значения: def makeConnection(url: String, timeout: Int = 5000): Unit = println(s\"url=$url, timeout=$timeout\") makeConnection(\"https://localhost\") // url=https://localhost, timeout=5000 makeConnection(\"https://localhost\", 2500) // url=https://localhost, timeout=2500 Также можно использовать именованные параметры: makeConnection(url = \"https://localhost\", timeout = 2500) // url=https://localhost, timeout=2500 Именованные параметры особенно полезны, когда несколько параметров метода имеют один и тот же тип. На первый взгляд, можно задаться вопросом, какие параметры установлены в значение true или false: engage(true, true, true, false) Гораздо более понятным выглядит использование именованных переменных: engage( speedIsSet = true, directionIsSet = true, picardSaidMakeItSo = true, turnedOffParkingBrake = false ) Расширяемые методы Extension methods позволяют добавлять новые методы в закрытые классы. Пример добавления двух методов в класс String: extension (s: String) def hello: String = s\"Hello, ${s.capitalize}!\" def aloha: String = s\"Aloha, ${s.capitalize}!\" \"world\".hello // res5: String = \"Hello, World!\" \"friend\".aloha // res6: String = \"Aloha, Friend!\" Ключевое слово extension объявляет о намерении определить один или несколько методов расширения для параметра, заключенного в круглые скобки. Как показано в примере выше, параметры типа String затем могут быть использованы в теле методов расширения. В следующем примере показано, как добавить метод makeInt в класс String. Здесь makeInt принимает параметр с именем radix. Код не учитывает возможные ошибки преобразования строки в целое число, но, пропуская эту деталь, примеры показывают, как это работает: extension (s: String) def makeInt(radix: Int): Int = Integer.parseInt(s, radix) \"1\".makeInt(2) // res7: Int = 1 \"10\".makeInt(2) // res8: Int = 2 \"100\".makeInt(2) // res9: Int = 4 References: Scala3 book"
    } ,    
    {
      "title": "Моделирование данных в ООП и ФП",
      "url": "/scalaworkbook/docs/modeling.html",
      "content": "Моделирование данных в ООП и ФП OOP Domain Modeling При написании кода в стиле ООП двумя основными инструментами для инкапсуляции данных являются traits и classes. Traits traits можно использовать как простые интерфейсы, но они также могут содержать абстрактные и конкретные методы и поля, и они могут иметь параметры, как и классы. Классы и объекты могут расширять несколько traits. Рассмотрим пример: trait Speaker: def speak(): String trait TailWagger: def startTail(): Unit = println(\"tail is wagging\") def stopTail(): Unit = println(\"tail is stopped\") trait Runner: def startRunning(): Unit = println(\"I’m running\") def stopRunning(): Unit = println(\"Stopped running\") Класс Dog может расширить все три trait-а, определяя абстрактный метод speak: class Dog(name: String) extends Speaker, TailWagger, Runner: def speak(): String = \"Woof!\" val dog = Dog(\"Rover\") Класс также может переопределять методы trait-ов. Рассмотрим пример класса Cat: class Cat(name: String) extends Speaker, TailWagger, Runner: def speak(): String = \"Meow\" override def startRunning(): Unit = println(\"Yeah ... I don’t run\") override def stopRunning(): Unit = println(\"No need to stop\") val cat = Cat(\"Morris\") В результате получим: dog.speak() // res0: String = \"Woof!\" dog.startRunning() // I’m running dog.stopRunning() // Stopped running cat.speak() // res3: String = \"Meow\" cat.startRunning() // Yeah ... I don’t run cat.stopRunning() // No need to stop Classes Классы используются для разработки в стиле ООП. Вот пример класса, который моделирует “человека”. class Person(firstName: String, lastName: String): override def toString: String = s\"$firstName $lastName\" Person(\"John\", \"Stephens\") // res6: Person = John Stephens FP Domain Modeling При написании кода в стиле FP можно использовать такие конструкции: Enums Case classes Traits Enums Конструкция enum - отличный способ моделирования алгебраических типов данных. Например: enum CrustSize: case Small, Medium, Large enum можно использовать в матчинге и условиях: import CrustSize.* val currentCrustSize = Small // currentCrustSize: CrustSize = Small currentCrustSize match case Small =&gt; println(\"Small crust size\") case Medium =&gt; println(\"Medium crust size\") case Large =&gt; println(\"Large crust size\") // Small crust size if currentCrustSize == Small then println(\"Small crust size\") // Small crust size Ещё один пример enum-а: enum Nat: case Zero case Succ(pred: Nat) Case classes Scala case class позволяет моделировать концепции с неизменяемыми структурами данных. case class обладает всеми функциональными возможностями класса, а также имеет встроенные дополнительные функции, которые делают их полезными для функционального программирования. case class имеет следующие эффекты и преимущества: Параметры конструктора case class по умолчанию являются общедоступными полями val, поэтому поля являются неизменяемыми, а методы доступа генерируются для каждого параметра. Генерируется метод unapply, который позволяет использовать case class в match выражениях. В классе создается метод copy, который позволяет создавать копии объекта без изменения исходного объекта. генерируются методы equals и hashCode для проверки структурного равенства. генерируется метод toString, который полезен для отладки. Этот код демонстрирует несколько функций case class: case class Person(name: String, vocation: String) val p = Person(\"Reginald Kenneth Dwight\", \"Singer\") // p: Person = Person(name = \"Reginald Kenneth Dwight\", vocation = \"Singer\") p.name // res10: String = \"Reginald Kenneth Dwight\" p.name = \"Joe\" // error: // Reassignment to val name // p.name = \"Joe\" // ^^^^^^^^^^^^^^ val p2 = p.copy(name = \"Elton John\") // p2: Person = Person(name = \"Elton John\", vocation = \"Singer\") References: Scala3 book"
    } ,    
    {
      "title": "Singleton objects",
      "url": "/scalaworkbook/docs/objects.html",
      "content": "Singleton objects В Scala ключевое слово object создает одноэлементный объект (singleton). Другими словами, объект определяет класс, который имеет ровно один экземпляр. Объекты имеют несколько применений: Они используются для создания коллекций служебных методов. companion object - это объект, имеющий то же имя, что и класс, с которым он совместно использует файл. В этой ситуации класс называется companion class. Они используются для имплементации traits для создания modules. “Полезные” методы Поскольку объект является одноэлементным, к его методам можно получить доступ, как к статическим методам в классе Java. Например, этот объект StringUtils содержит небольшую коллекцию методов, связанных со строками: object StringUtils: def isNullOrEmpty(s: String): Boolean = s == null || s.trim.isEmpty def leftTrim(s: String): String = s.replaceAll(\"^\\\\s+\", \"\") def rightTrim(s: String): String = s.replaceAll(\"\\\\s+$\", \"\") Поскольку StringUtils является одноэлементным, его методы могут вызываться непосредственно в объекте: StringUtils.isNullOrEmpty(\"\") // res0: Boolean = true StringUtils.isNullOrEmpty(\"a\") // res1: Boolean = false Companion objects Сопутствующий класс или объект может получить доступ к закрытым членам своего сопутствующего соседа. Сопутствующий объект (companion objects) используется для методов и значений, которые не являются специфичными для экземпляров сопутствующего класса. Пример демонстрирует, как метод area в сопутствующем классе может получить доступ к приватному методу calculateArea в его сопутствующем объекте: import scala.math.* class Circle(radius: Double): import Circle.* def area: Double = calculateArea(radius) object Circle: private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0) val circle = Circle(5.0) circle.area // res2: Double = 78.53981633974483 Создание модулей из traits Объекты также могут быть использованы для реализации traits для создания модулей. Эта техника использует два trait-а и объединяет их для создания конкретного объекта: trait AddService: def add(a: Int, b: Int) = a + b trait MultiplyService: def multiply(a: Int, b: Int) = a * b object MathService extends AddService, MultiplyService import MathService.* add(1,1) // res3: Int = 2 multiply(2,2) // res4: Int = 4 References: Scala3 book"
    } ,        
    {
      "title": "Источники",
      "url": "/scalaworkbook/sources.html",
      "content": "Список источников Книги: Scala 3, official documentation Michael Pilquist, Rúnar Bjarnason, and Paul Chiusano - Functional Programming in Scala, Second Edition Статьи … Курсы …"
    } ,    
    {
      "title": "Основные конструкции",
      "url": "/scalaworkbook/docs/structures.html",
      "content": "{{page.title}} if/else if/else выглядит так же, как и в других языках: def detect(x: Int) = if x &lt; 0 then println(\"negative\") else if x == 0 then println(\"zero\") else println(\"positive\") detect(-1) // negative detect(0) // zero detect(1) // positive Обратите внимание, что это действительно выражение, а не утверждение. Это означает, что if/else возвращает значение, поэтому его результат можно присвоить переменной: val x = if a &lt; b then a else b Как будет видно на протяжении всей этой документации, все структуры управления Scala можно использовать в качестве выражений. for loops and expressions val ints = List(1, 2, 3, 4, 5) for i &lt;- ints do print(s\"$i \") // 1 2 3 4 5 Можно добавлять условия: for i &lt;- ints if i &gt; 2 do print(s\"$i \") // 3 4 5 А также несколько переменных: for i &lt;- 1 to 3 j &lt;- 'a' to 'c' if i == 2 if j == 'b' do println(s\"i = $i, j = $j\") // i = 2, j = b Замена do на yield позволяет вычислять выражения: val fruits = List(\"apple\", \"banana\", \"lime\", \"orange\") for f &lt;- fruits if f.length &gt; 4 yield f.capitalize // res6: List[String] = List(\"Apple\", \"Banana\", \"Orange\") match expressions Сопоставление с шаблоном: case class Person(name: String) def getQuote(p: Person): String = p match case Person(name) if name == \"Fred\" =&gt; s\"$name says, Yubba dubba doo\" case Person(\"Bam Bam\") =&gt; // или даже так \"Bam Bam says, Bam bam!\" case _ =&gt; \"Watch the Flintstones!\" getQuote(Person(\"Fred\")) // res7: String = \"Fred says, Yubba dubba doo\" getQuote(Person(\"Bam Bam\")) // res8: String = \"Bam Bam says, Bam bam!\" getQuote(Person(\"Aaron\")) // res9: String = \"Watch the Flintstones!\" try/catch/finally Перехват исключений: def parseInt(s: String): Option[Int] = try Some(s.toInt) catch case nfe: NumberFormatException =&gt; println(\"Got a NumberFormatException.\") None finally println(\"Clean up your resources here.\") parseInt(\"1\") // Clean up your resources here. // res10: Option[Int] = Some(value = 1) parseInt(\"one\") // Got a NumberFormatException. // Clean up your resources here. // res11: Option[Int] = None while loops var x = 1 // x: Int = 1 while x &lt; 3 do println(x) x += 1 // 1 // 2 В Scala не приветствуется использование изменяемых переменных var, поэтому следует избегать while. Аналогичный результат можно достигнуть используя вспомогательный метод: def loop(x: Int): Unit = if x &lt; 3 then println(x) loop(x + 1) loop(1) // 1 // 2 References: Scala3 book"
    } ,    
    {
      "title": "Верхнеуровневые определения",
      "url": "/scalaworkbook/docs/toplevel-definitions.html",
      "content": "{{page.title}} В Scala 3 все виды определений могут быть записаны на “верхнем уровне” ваших файлов исходного кода. Например, вы можете создать файл с именем MyCoolApp.scala и поместить в него данное содержимое: import scala.collection.mutable.ArrayBuffer enum Topping: case Cheese, Pepperoni, Mushrooms import Topping.* class Pizza: val toppings = ArrayBuffer[Topping]() val p = Pizza() extension (s: String) def capitalizeAllWords = s.split(\" \").map(_.capitalize).mkString(\" \") val hwUpper = \"hello, world\".capitalizeAllWords type Money = BigDecimal // по желанию дополнительные определения... @main def myApp = p.toppings += Cheese println(\"show me the code\".capitalizeAllWords) Как показано, нет необходимости помещать эти определения внутри пакета, класса или другой конструкции. Этот подход заменяет package objects из Scala 2. Но, будучи намного проще в использовании, они работают аналогично: когда вы помещаете определение в пакет с именем foo, вы можете получить доступ к этому определению во всех других пакетах в foo, например, в пакете foo.bar в этом примере: package foo { def double(i: Int) = i * 2 } package foo { package bar { @main def fooBarMain = println(s\"${double(1)}\") } } Фигурные скобки используются в этом примере, чтобы подчеркнуть вложенность пакета. Преимущество такого подхода заключается в том, что можно размещать определения в пакете с именем com.acme.myapp, а затем можно ссылаться на эти определения в com.acme.myapp.model, com.acme.myapp.controller и т.д. References: Scala3 book"
    } ,    
    {
      "title": "Переменные и типы данных",
      "url": "/scalaworkbook/docs/types.html",
      "content": "{{page.title}} В этом разделе представлен обзор переменных и типов данных Scala. Два типа переменных Когда вы создаете новую переменную в Scala, вы объявляете, является ли переменная неизменяемой или изменяемой: Тип Описание val Создает неизменяемую переменную, подобную final в Java. Вы всегда должны создавать переменную с помощью val, если только нет причины, по которой вам нужна изменяемая переменная. var Создает изменяемую переменную, и ее следует использовать только в крайне редких случаях, когда содержимое переменной будет меняться с течением времени. В примере показано, как создавать val и var переменные: val a = 0 // a: Int = 0 var b = 1 // b: Int = 1 Значение val не может быть переназначено. Если попытаться переназначить, то будет получена ошибка компиляции: val msg = \"Hello, world\" msg = \"Aloha\" // error: // Reassignment to val msg // var a = BigInt(1_234_567_890_987_654_321L) // ^ И наоборот, var может быть переназначен: var msg = \"Hello, world\" // msg: String = \"Hello, world\" msg = \"Aloha\" msg // res2: String = \"Aloha\" Объявление типов переменных Когда создается переменная, можно явно объявить ее тип или позволить определить тип компилятору: val x: Int = 1 val x = 1 Вторая форма известна как вывод типа (type inference), и это отличный способ помочь сохранить код кратким. Компилятор Scala обычно может определить тип данных, как показано в выходных данных этих примеров: val x = 1 // x: Int = 1 val s = \"a string\" // s: String = \"a string\" val nums = List(1, 2, 3) // nums: List[Int] = List(1, 2, 3) Всегда можно явно объявить тип переменной, но в простых примерах, подобных этим, в этом нет необходимости: val x: Int = 1 val s: String = \"a string\" val p: Person = Person(\"Richard\") Встроенные типы данных Scala поставляется со стандартными числовыми типами данных, и все они являются полномасштабными экземплярами классов. В Scala все является объектом. Эти примеры показывают, как объявлять переменные числовых типов: val b: Byte = 1 val i: Int = 1 val l: Long = 1 val s: Short = 1 val d: Double = 2.0 val f: Float = 3.0 Поскольку Int и Double являются числовыми типами по умолчанию, их можно создавать без явного объявления типа данных: val i = 123 // i: Int = 123 val j = 1.0 // j: Double = 1.0 Также можно добавить символы L, D, and F (и их эквивалент в нижнем регистре) для того, чтобы задать Long, Double, или Float значения: val x = 1_000L // x: Long = 1000L val y = 2.2D // y: Double = 2.2 val z = 3.3F // z: Float = 3.3F Для действительно больших чисел можно использовать типы BigInt и BigDecimal: var a = BigInt(1_234_567_890_987_654_321L) // a: BigInt = 1234567890987654321 var b = BigDecimal(123_456.789) // b: BigDecimal = 123456.789 Где Double и Float являются приблизительными десятичными числами, а BigDecimal используется для точной арифметики. В Scala также есть типы String и Char: val name = \"Bill\" // name: String = \"Bill\" val c = 'a' // c: Char = 'a' Строки Строки Scala похожи на строки Java, но у них есть две замечательные дополнительные функции: они поддерживают интерполяцию строк создавать многострочные строки очень просто String interpolation Интерполяция строк обеспечивает очень удобный способ использования переменных внутри строк. Например, учитывая эти три переменные: val firstName = \"John\" val mi = 'C' val lastName = \"Doe\" их комбинацию можно получить так: s\"Name: $firstName $mi $lastName\" // res4: String = \"Name: John C Doe\" Просто поставьте перед строкой букву s, а затем поставьте символ $ перед именами переменных внутри строки. Чтобы вставить произвольные выражения в строку, заключите их в фигурные скобки: s\"2 + 2 = ${2 + 2}\" // res6: String = \"2 + 2 = 4\" val x = -1 // x: Int = -1 s\"x.abs = ${x.abs}\" // res7: String = \"x.abs = 1\" Символ s, который вы помещаете перед строкой, является лишь одним из возможных интерполяторов. Если вы используете f вместо s, вы можете использовать синтаксис форматирования в стиле printf в строке. Кроме того, интерполятор строк - это всего лишь специальный метод, и его можно определить самостоятельно. Например, некоторые библиотеки баз данных определяют очень мощный интерполятор sql. Multiline strings Многострочные строки создаются путем включения строки в три двойные кавычки: val quote = \"\"\"The essence of Scala: Fusion of functional and object-oriented programming in a typed setting.\"\"\" // quote: String = \"\"\"The essence of Scala: // Fusion of functional and object-oriented // programming in a typed setting.\"\"\" println(quote) // The essence of Scala: // Fusion of functional and object-oriented // programming in a typed setting. Здесь также можно использовать переменные внутри строки. References: Scala3 book"
    }    
  ];

  idx = lunr(function () {
    this.ref("title");
    this.field("content");

    docs.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  docs.forEach(function (doc) {
    docMap.set(doc.title, doc.url);
  });
}

// The onkeypress handler for search functionality
function searchOnKeyDown(e) {
  const keyCode = e.keyCode;
  const parent = e.target.parentElement;
  const isSearchBar = e.target.id === "search-bar";
  const isSearchResult = parent ? parent.id.startsWith("result-") : false;
  const isSearchBarOrResult = isSearchBar || isSearchResult;

  if (keyCode === 40 && isSearchBarOrResult) {
    // On 'down', try to navigate down the search results
    e.preventDefault();
    e.stopPropagation();
    selectDown(e);
  } else if (keyCode === 38 && isSearchBarOrResult) {
    // On 'up', try to navigate up the search results
    e.preventDefault();
    e.stopPropagation();
    selectUp(e);
  } else if (keyCode === 27 && isSearchBarOrResult) {
    // On 'ESC', close the search dropdown
    e.preventDefault();
    e.stopPropagation();
    closeDropdownSearch(e);
  }
}

// Search is only done on key-up so that the search terms are properly propagated
function searchOnKeyUp(e) {
  // Filter out up, down, esc keys
  const keyCode = e.keyCode;
  const cannotBe = [40, 38, 27];
  const isSearchBar = e.target.id === "search-bar";
  const keyIsNotWrong = !cannotBe.includes(keyCode);
  if (isSearchBar && keyIsNotWrong) {
    // Try to run a search
    runSearch(e);
  }
}

// Move the cursor up the search list
function selectUp(e) {
  if (e.target.parentElement.id.startsWith("result-")) {
    const index = parseInt(e.target.parentElement.id.substring(7));
    if (!isNaN(index) && (index > 0)) {
      const nextIndexStr = "result-" + (index - 1);
      const querySel = "li[id$='" + nextIndexStr + "'";
      const nextResult = document.querySelector(querySel);
      if (nextResult) {
        nextResult.firstChild.focus();
      }
    }
  }
}

// Move the cursor down the search list
function selectDown(e) {
  if (e.target.id === "search-bar") {
    const firstResult = document.querySelector("li[id$='result-0']");
    if (firstResult) {
      firstResult.firstChild.focus();
    }
  } else if (e.target.parentElement.id.startsWith("result-")) {
    const index = parseInt(e.target.parentElement.id.substring(7));
    if (!isNaN(index)) {
      const nextIndexStr = "result-" + (index + 1);
      const querySel = "li[id$='" + nextIndexStr + "'";
      const nextResult = document.querySelector(querySel);
      if (nextResult) {
        nextResult.firstChild.focus();
      }
    }
  }
}

// Search for whatever the user has typed so far
function runSearch(e) {
  if (e.target.value === "") {
    // On empty string, remove all search results
    // Otherwise this may show all results as everything is a "match"
    applySearchResults([]);
  } else {
    const tokens = e.target.value.split(" ");
    const moddedTokens = tokens.map(function (token) {
      // "*" + token + "*"
      return token;
    })
    const searchTerm = moddedTokens.join(" ");
    const searchResults = idx.search(searchTerm);
    const mapResults = searchResults.map(function (result) {
      const resultUrl = docMap.get(result.ref);
      return { name: result.ref, url: resultUrl };
    })

    applySearchResults(mapResults);
  }

}

// After a search, modify the search dropdown to contain the search results
function applySearchResults(results) {
  const dropdown = document.querySelector("div[id$='search-dropdown'] > .dropdown-content.show");
  if (dropdown) {
    //Remove each child
    while (dropdown.firstChild) {
      dropdown.removeChild(dropdown.firstChild);
    }

    //Add each result as an element in the list
    results.forEach(function (result, i) {
      const elem = document.createElement("li");
      elem.setAttribute("class", "dropdown-item");
      elem.setAttribute("id", "result-" + i);

      const elemLink = document.createElement("a");
      elemLink.setAttribute("title", result.name);
      elemLink.setAttribute("href", result.url);
      elemLink.setAttribute("class", "dropdown-item-link");

      const elemLinkText = document.createElement("span");
      elemLinkText.setAttribute("class", "dropdown-item-link-text");
      elemLinkText.innerHTML = result.name;

      elemLink.appendChild(elemLinkText);
      elem.appendChild(elemLink);
      dropdown.appendChild(elem);
    });
  }
}

// Close the dropdown if the user clicks (only) outside of it
function closeDropdownSearch(e) {
  // Check if where we're clicking is the search dropdown
  if (e.target.id !== "search-bar") {
    const dropdown = document.querySelector("div[id$='search-dropdown'] > .dropdown-content.show");
    if (dropdown) {
      dropdown.classList.remove("show");
      document.documentElement.removeEventListener("click", closeDropdownSearch);
    }
  }
}
