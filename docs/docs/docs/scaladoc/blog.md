---
layout: docsplus
title: "Блог"
section: scala
prev: scaladoc/static-site
next: scaladoc/site-versioning
---

## Встроенный блог

Scaladoc позволяет включить в документацию простой блог. 


### Правильная настройка каталога

Сообщения в блоге должны быть помещены в каталог `_blog/_posts`.

```text
├── _blog
│   ├── _posts
│   │   └── 2022-06-17-implicit-function-types.md
│   └── index.html
```

Scaladoc загружает блог, если существует каталог `_blog`.


### Соглашение об именовании

Все имена файлов сообщений блога должны начинаться с даты в числовом формате, соответствующем `YYYY-MM-DD`. 
Пример имени `2022-06-17-dotty-compiler-bootstraps.md`.


---

**References:**
- [Scaladoc Guide](https://docs.scala-lang.org/scala3/guides/scaladoc/blog.html)
