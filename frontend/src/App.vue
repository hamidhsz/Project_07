<template>
  <div id="app">
    <router-view />
  </div>

</template>

<style lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  color: black;
  font-family: 'Roboto', 'Arial', sans-serif;
};

#main {
  padding: 40px;
}

h1, h2 {
  font-family: 'Raleway', 'Arial', sans-serif;
}

label {
  font-style: italic;
}

a {
  font-size: 16px;

  &:hover {
    font-weight: bold;
    color: #1148a8;
  }
}

i {
  font-size: 20px;
  color: #122442;
}

input, textarea {
  font-size: 16px;
  padding: 5px;
  border-radius: 10px;
}
#app {
  width: 100%;
}

</style>


