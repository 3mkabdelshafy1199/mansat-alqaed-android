
name: Build Android APK

on:
  workflow_dispatch:
  push:
    paths:
      - 'mansat-alqaed-android-project.zip'
      - '.github/workflows/build-apk.yml'

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'

      - name: Extract Android project
        run: |
          unzip -q mansat-alqaed-android-project.zip -d extracted
          test -f extracted/android-project/settings.gradle
          test -f extracted/android-project/app/build.gradle

      - name: Build APK
        working-directory: extracted/android-project
        run: gradle assembleDebug

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: mansat-alqaed-debug-apk
          path: extracted/android-project/app/build/outputs/apk/debug/app-debug.apk
          if-no-files-found: error
