import Dependencies.Version._
import microsites._

ThisBuild / organization := "io.github.artemkorsakov"
ThisBuild / version := "0.1.0-SNAPSHOT"
ThisBuild / scalaVersion := Scala3
ThisBuild / autoAPIMappings := true

ThisBuild / githubWorkflowBuildPreamble ++= Seq(
  WorkflowStep
    .Use(UseRef.Public("ruby", "setup-ruby", "v1"), name = Some("Setup Ruby"), params = Map("ruby-version" -> "2.7")),
  WorkflowStep.Run(List("gem install jekyll -v 4"), name = Some("Install Jekyll"))
)
ThisBuild / githubWorkflowBuildPostamble := Seq(
  WorkflowStep.Sbt(List("publishMicrosite"), name = Some("Publish site"))
)
ThisBuild / githubWorkflowPublishTargetBranches := Seq()

lazy val scaladoc = (project in file("scaladoc"))
  .settings(
    name := "scaladoc-example"
  )

lazy val docs = project
  .dependsOn(scaladoc)
  .enablePlugins(MicrositesPlugin, ScalaUnidocPlugin)
  .settings(
    micrositeName := "Scala workbook",
    micrositeDescription := "Разработка на Scala.",
    micrositeUrl := "https://artemkorsakov.github.io",
    micrositeBaseUrl := "/scalaworkbook",
    micrositeDocumentationUrl := "/scalaworkbook/docs",
    micrositeDocumentationLabelDescription := "Документация",
    micrositeAuthor := "Артём Корсаков",
    micrositeGithubOwner := "artemkorsakov",
    micrositeGithubRepo := "scalaworkbook",
    micrositeEditButton := Some(
      MicrositeEditButton("Редактировать страницу", "/edit/main/docs/docs/{{ page.path }}")
    ),
    micrositeGithubToken := sys.env.get("GITHUB_TOKEN"),
    micrositePushSiteWith := GitHub4s,
    micrositeGitterChannel := false,
    micrositeShareOnSocial := false,
    micrositeGithubLinks := false,
    mdocExtraArguments := List("--no-link-hygiene"),
    micrositeTheme := "pattern",
    micrositePalette := Map(
      "brand-primary" -> "#5B59B0",
      "brand-secondary" -> "#292E53",
      "brand-tertiary" -> "#222749",
      "gray-dark" -> "#49494B",
      "gray" -> "#7B7B7E",
      "gray-light" -> "#E5E5E6",
      "gray-lighter" -> "#F4F3F4",
      "white-color" -> "#FFFFFF"
    ),
    mdocVariables := Map(
      "SCALA" -> Scala3,
      "SBT_VERSION" -> "1.6.2",
      "DOC" -> "/scalaworkbook/docs/",
      "API" -> "/scalaworkbook/api/",
      "PATTERNS" -> "/scalaworkbook/design-patterns/",
    ),
    ScalaUnidoc / unidoc / unidocProjectFilter := inProjects(scaladoc),
    ScalaUnidoc / siteSubdirName := "api",
    apiURL := Some(url(s"${micrositeUrl.value}${micrositeBaseUrl.value}/${ScalaUnidoc / siteSubdirName}/")),
    addMappingsToSiteDir(ScalaUnidoc / packageDoc / mappings, ScalaUnidoc / siteSubdirName),
    // Static site
    Compile / doc / scalacOptions := Seq(
      "-project",
      "Сайт сгенеренный Scaladoc",
      "-project-version",
      version.value,
      "-project-footer",
      "Этот текст будет отображаться в footer-е",
      "-siteroot",
      "./scaladoc/site",
      "-doc-root-content",
      "./scaladoc/api.md",
      "-Ygenerate-inkuire",
      "-snippet-compiler:compile",
      "-source-links:scaladoc=github://artemkorsakov/scalaworkbook/main#scaladoc"
    )
  )

lazy val workbook = (project in file("workbook"))
  .settings(
    name := "workbook",
    libraryDependencies ++= Dependencies.workbook
  )

lazy val root = (project in file("."))
  .aggregate(scaladoc, workbook, docs)
  .settings(
    name := "scalaworkbook"
  )
