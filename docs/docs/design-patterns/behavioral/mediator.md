---
layout: dp
title: "Mediator"
section: dp
prev: behavioral/iterator
next: behavioral/memento
---

## {{page.title}}

#### Назначение

Определение объекта, который инкапсулирует способ взаимодействия набора объектов. 
Медиатор способствует слабой связи, не позволяя объектам явно ссылаться друг на друга, 
и позволяет независимо изменять их взаимодействие.

#### Диаграмма

![Mediator](https://upload.wikimedia.org/wikipedia/commons/e/e4/Mediator_design_pattern.png?uselang=ru)

#### Пример

Классы `ListBox` и `EntryField` — наши классы-коллеги, оба — `Widget`-ы. 
`DialogDirector` содержит вложенный трейт `ListBoxDir`, который перехватывает каждый раз, когда щелкают наш список. 
При нажатии на него вызывается `listBoxChanged`, что приводит к установке текста в нашем поле ввода с текущим выбором списка. 
Это простой пример взаимодействия объектов. 
Обратите внимание, что коллеги совершенно не знают о посреднике и, следовательно, о самой схеме.


```scala mdoc:silent
// Widgets
class ListBox:
  def getSelection: String = "selected"
  def click(): Unit = ()

class EntryField:
  def setText(s: String): Unit = println(s)

class DialogDirector:
  protected trait ListBoxDir extends ListBox:
    abstract override def click(): Unit =
      super.click()
      listBoxChanged()

  // Colleagues
  val listBox: ListBox = new ListBox with ListBoxDir
  val entryField: EntryField = new EntryField

  // Directing methods
  def showDialog(): Unit = ()

  // called when listBox is clicked via advice
  def listBoxChanged(): Unit = entryField.setText(listBox.getSelection)

end DialogDirector
```

```scala mdoc
val dialog = new DialogDirector
val listBox = dialog.listBox
val entryField = dialog.entryField
listBox.click()
```


---

**References:**
- [Scala & Design Patterns by Frederik Skeel Løkke](https://www.scala-lang.org/old/sites/default/files/FrederikThesis.pdf)
- [Wikipedia](https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D1%81%D1%80%D0%B5%D0%B4%D0%BD%D0%B8%D0%BA_(%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F))
