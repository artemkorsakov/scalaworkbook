---
layout: docsplus
title: "Worksheet"
prev: ../type-system/types-others
next: ../abstractions/ca-given-using
---

## {{page.title}}

Worksheet - это файл Scala, который вычисляется при сохранении, 
и результат каждого выражения отображается в столбце справа от программы. 
Рабочие листы похожи на [сеанс REPL](../repl) и имеют поддержку редактора 1-го класса: 
завершение, гиперссылки, интерактивные ошибки при вводе и т.д. 
Рабочие листы используют расширение `.worksheet.sc`.

Далее покажем, как использовать рабочие листы в IntelliJ и в VS Code (с расширением Metals).

1) Откройте проект Scala или создайте его:
- чтобы создать проект в IntelliJ, выберите "File" -> "New" -> "Project...", 
выберите "Scala" в левой колонке и нажмите "Далее", чтобы задать название проекта и каталог.
- чтобы создать проект в VS Code, выполните команду "Metals: New Scala project", 
выберите начальный `scala/scala3.g8`, задайте местоположение проекта, 
откройте его в новом окне VS Code и импортируйте сборку.

2) Создайте файл с именем `hello.worksheet.sc` в каталоге `src/main/scala/`.
- в IntelliJ щелкните правой кнопкой мыши на каталоге `src/main/scala/` и выберите "New", а затем "File".
- в VS Code щелкните правой кнопкой мыши на каталоге `src/main/scala/` и выберите "New File".

3) Вставьте следующее содержимое в редактор:

```
println("Hello, world!")
   
val x = 1
x + x
```

4) Запустите worksheet:
- в IntelliJ щелкните зеленую стрелку в верхней части редактора, чтобы запустить worksheet
- в VS Code сохраните файл

Вы должны увидеть результат выполнения каждой строки на правой панели (IntelliJ) или в виде комментариев (VS Code).

IntelliJ:

![IntelliJ](https://docs.scala-lang.org/resources/images/scala3-book/intellij-worksheet.png)

VS Code:

![VS Code](https://docs.scala-lang.org/resources/images/scala3-book/metals-worksheet.png)

Обратите внимание, что worksheet будет использовать версию Scala, 
определенную проектом (обычно задается ключом `scalaVersion` в файле `build.sbt`).

Также обратите внимание, что worksheet не имеют [точек входа в программу](../methods/main-methods). 
Вместо этого операторы и выражения верхнего уровня оцениваются сверху вниз.


---

**References:**
- [Scala3 book](https://docs.scala-lang.org/scala3/book/tools-worksheets.html)
