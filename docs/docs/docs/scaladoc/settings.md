---
layout: docsplus
title: "Настройки"
prev: scaladoc/snippet-compiler
next: extra
---

## {{page.title}}

В этой главе перечислены параметры конфигурации, которые можно использовать при вызове scaladoc. 
Некоторую информацию, показанную здесь, можно получить, вызвав scaladoc с флагом `-help`.

### Изменения scaladoc по сравнению со Scala 2

Scaladoc был переписан с нуля, и некоторые функции оказались бесполезными в новом контексте. 
Текущее состояние совместимости со старыми флагами scaladoc 
можно [увидеть здесь](https://github.com/lampepfl/dotty/issues/11907).

### Указание настроек

Настройки scaladoc можно указывать в качестве аргументов командной строки, 
например, `scaladoc -d output -project my-project target/scala-3.0.0-RC2/classes`. 
При вызове из sbt, 
обновите значение `Compile / doc / scalacOptions` и `Compile / doc / target` 
соответственно, например

```sbt
Compile / doc / target := file("output"),
Compile / doc / scalacOptions ++= Seq("-project", "my-project"),
```






---

**References:**
- [Scaladoc Guide](https://docs.scala-lang.org/scala3/guides/scaladoc/settings.html)
