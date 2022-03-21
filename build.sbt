import Dependencies.Version._
import microsites._

ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := Scala3

ThisBuild / scalacOptions ++= List("-feature", "-deprecation", "-Ykind-projector:underscores", "-source:future")

ThisBuild / githubWorkflowPublishTargetBranches := Seq()

lazy val root = (project in file("workbook"))
  .settings(
    name := "workbook",
    libraryDependencies ++= Dependencies.workbook
  )

lazy val docs = project
  .dependsOn(root)
  .enablePlugins(MicrositesPlugin)
  .settings(
    micrositeName := "Scala workbook",
    micrositeDescription := "Разработка на Scala. Рабочая тетрадь.",
    micrositeUrl := "https://artemkorsakov.github.io",
    micrositeBaseUrl := "/scalaworkbook",
    micrositeDocumentationUrl := "/scalaworkbook/docs",
    micrositeDocumentationLabelDescription := "Documentation",
    micrositeAuthor := "Artem Korsakov",
    micrositeGithubOwner := "artemkorsakov",
    micrositeGithubRepo := "scalaworkbook",
    micrositeTheme := "pattern",
    micrositeEditButton := Some(
      MicrositeEditButton("Improve this Page", "/edit/main/docs/docs/{{ page.path }}")
    ),
    micrositeGithubToken := sys.env.get("GITHUB_TOKEN"),
    micrositePushSiteWith := GitHub4s,
    micrositeGitterChannel := false,
    micrositePalette := Map(
      "brand-primary" -> "#5B5988",
      "brand-secondary" -> "#292E53",
      "brand-tertiary" -> "#222749",
      "gray-dark" -> "#49494B",
      "gray" -> "#7B7B7E",
      "gray-light" -> "#E5E5E6",
      "gray-lighter" -> "#F4F3F4",
      "white-color" -> "#FFFFFF"
    ),
    apiURL := None,
    mdocVariables := Map(
      "SCALA" -> Scala3,
      "DESCRIPTION" -> micrositeDescription.value,
      "DOC_SITE" -> s"${micrositeUrl.value}${micrositeDocumentationUrl.value}",
      "SOURCE_LINK" -> s"${micrositeUrl.value}${micrositeBaseUrl.value}/sources.html"
    )
  )
