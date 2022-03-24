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
      "title": "Scala",
      "url": "/scalaworkbook/docs/basic.html",
      "content": "Scala Ядро Scala: Основные конструкции Моделирование данных"
    } ,    
    {
      "title": "Моделирование данных в ООП и ФП",
      "url": "/scalaworkbook/docs/basic/domain_modeling.html",
      "content": "OOP Domain Modeling При написании кода в стиле ООП двумя основными инструментами для инкапсуляции данных являются traits и classes. Traits Scala traits можно использовать как простые интерфейсы, но они также могут содержать абстрактные и конкретные методы и поля, и они могут иметь параметры, как и классы. Классы и объекты могут расширять несколько traits. Рассмотрим пример: trait Speaker: def speak(): String trait TailWagger: def startTail(): Unit = println(\"tail is wagging\") def stopTail(): Unit = println(\"tail is stopped\") trait Runner: def startRunning(): Unit = println(\"I’m running\") def stopRunning(): Unit = println(\"Stopped running\") Класс Dog может расширить все три trait-а, определяя абстрактный метод speak: class Dog(name: String) extends Speaker, TailWagger, Runner: def speak(): String = \"Woof!\" Класс также может переопределять методы trait-ов. Рассмотрим пример класса Cat: class Cat(name: String) extends Speaker, TailWagger, Runner: def speak(): String = \"Meow\" override def startRunning(): Unit = println(\"Yeah ... I don’t run\") override def stopRunning(): Unit = println(\"No need to stop\") В результате получим: val dog = Dog(\"Rover\") val cat = Cat(\"Morris\") dog.speak() // res0: String = \"Woof!\" dog.startRunning() // I’m running dog.stopRunning() // Stopped running cat.speak() // res3: String = \"Meow\" cat.startRunning() // Yeah ... I don’t run cat.stopRunning() // No need to stop Classes Классы используются в программировании в стиле ООП. Вот пример класса, который моделирует “человека”. class Person(firstName: String, lastName: String): override def toString: String = s\"$firstName $lastName\" Person(\"John\", \"Stephens\") // res6: Person = John Stephens FP Domain Modeling При написании кода в стиле FP можно использовать такие конструкции: Enums Case classes Traits Enums Конструкция enum - отличный способ моделирования алгебраических типов данных. Например: enum CrustSize: case Small, Medium, Large enum можно использовать в матчинге и условиях: import CrustSize.* val currentCrustSize = Small // currentCrustSize: CrustSize = Small currentCrustSize match case Small =&gt; println(\"Small crust size\") case Medium =&gt; println(\"Medium crust size\") case Large =&gt; println(\"Large crust size\") // Small crust size if currentCrustSize == Small then println(\"Small crust size\") // Small crust size Ещё один пример enum-а: enum Nat: case Zero case Succ(pred: Nat) Case classes Scala case class позволяет моделировать концепции с неизменяемыми структурами данных. case class обладает всеми функциональными возможностями класса, а также имеет встроенные дополнительные функции, которые делают их полезными для функционального программирования. case class имеет следующие эффекты и преимущества: Параметры конструктора case class по умолчанию являются общедоступными полями val, поэтому поля являются неизменяемыми, а методы доступа генерируются для каждого параметра. Генерируется метод unapply, который позволяет использовать case class в match выражениях. В классе создается метод copy, который позволяет создавать копии объекта без изменения исходного объекта. генерируются методы equals и hashCode для проверки структурного равенства. генерируется метод toString, который полезен для отладки. Этот код демонстрирует несколько функций case class: case class Person(name: String, vocation: String) val p = Person(\"Reginald Kenneth Dwight\", \"Singer\") // p: Person = Person(name = \"Reginald Kenneth Dwight\", vocation = \"Singer\") p.name // res10: String = \"Reginald Kenneth Dwight\" p.name = \"Joe\" // error: // Reassignment to val name // p.name = \"Joe\" // ^^^^^^^^^^^^^^ val p2 = p.copy(name = \"Elton John\") // p2: Person = Person(name = \"Elton John\", vocation = \"Singer\")"
    } ,    
    {
      "title": "Рабочая тетрадь",
      "url": "/scalaworkbook/docs/",
      "content": "Рабочая тетрадь Разработка на Scala. Рабочая тетрадь. Код написан на версии Scala - 3.1.1."
    } ,    
    {
      "title": "Основная",
      "url": "/scalaworkbook/",
      "content": "Основная Обзор Разработка на Scala. Рабочая тетрадь. В этой рабочей тетради изложены основные принципы функциональной разработки на Scala, а также описание популярных библиотек. Код написан на версии Scala - 3.1.1. Документация Основные понятия"
    } ,        
    {
      "title": "Источники",
      "url": "/scalaworkbook/sources.html",
      "content": "Список источников Книги: Scala 3, official documentation Michael Pilquist, Rúnar Bjarnason, and Paul Chiusano - Functional Programming in Scala, Second Edition Статьи … Курсы …"
    } ,    
    {
      "title": "Основные конструкции",
      "url": "/scalaworkbook/docs/basic/structures.html",
      "content": "Конструкции в Scala Запуск main метода в Scala: @main def hello = println(\"Hello, world!\") Метод hello компилится в отдельный класс на уровне пакета с именем класса равным имени метода. В один файл можно добавлять несколько main методов с различными именами. if/else def detect(x: Int) = if x &lt; 0 then println(\"negative\") else if x == 0 then println(\"zero\") else println(\"positive\") detect(-1) // negative detect(0) // zero detect(1) // positive for loops and expressions val ints = List(1, 2, 3, 4, 5) for i &lt;- ints do print(s\"$i \") // 1 2 3 4 5 Можно добавлять условия: for i &lt;- ints if i &gt; 2 do print(s\"$i \") // 3 4 5 А также несколько переменных: for i &lt;- 1 to 3 j &lt;- 'a' to 'c' if i == 2 if j == 'b' do println(s\"i = $i, j = $j\") // i = 2, j = b Замена do на yield позволяет вычислять выражения: val fruits = List(\"apple\", \"banana\", \"lime\", \"orange\") for f &lt;- fruits if f.length &gt; 4 yield f.capitalize // res6: List[String] = List(\"Apple\", \"Banana\", \"Orange\") match expressions Сопоставление с шаблоном: case class Person(name: String) def getQuote(p: Person): String = p match case Person(name) if name == \"Fred\" =&gt; s\"$name says, Yubba dubba doo\" case Person(\"Bam Bam\") =&gt; // или даже так \"Bam Bam says, Bam bam!\" case _ =&gt; \"Watch the Flintstones!\" getQuote(Person(\"Fred\")) // res7: String = \"Fred says, Yubba dubba doo\" getQuote(Person(\"Bam Bam\")) // res8: String = \"Bam Bam says, Bam bam!\" getQuote(Person(\"Aaron\")) // res9: String = \"Watch the Flintstones!\" try/catch/finally Перехват исключений: def parseInt(s: String): Option[Int] = try Some(s.toInt) catch case nfe: NumberFormatException =&gt; println(\"Got a NumberFormatException.\") None finally println(\"Clean up your resources here.\") parseInt(\"1\") // Clean up your resources here. // res10: Option[Int] = Some(value = 1) parseInt(\"one\") // Got a NumberFormatException. // Clean up your resources here. // res11: Option[Int] = None while loops var x = 1 // x: Int = 1 while x &lt; 3 do println(x) x += 1 // 1 // 2 В Scala не приветствуется использование изменяемых переменных var, поэтому следует избегать использования while. Вместо этого можно создать вспомогательный метод: def loop(x: Int): Unit = if x &lt; 3 then println(x) loop(x + 1) loop(1) // 1 // 2"
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
