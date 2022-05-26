let modelsAdd = [
    {
      obj: "./models/0ban.obj",
      mtl: "./models/0ban.mtl",
      texture: "./models/texture/table2.jpg",
      mesh: null,
      img: './img/0ban.png'
    },
    {
      obj: "./models/1banan1.obj",
      mtl: "./models/1banan1.mtl",
      texture: "./models/texture/banan1.jpg",
      mesh: null,
      img: './img/1banan1.png'
    },
    {
      obj: "./models/2banan2.obj",
      mtl: "./models/2banan2.mtl",
      texture: "./models/texture/floor1.jpg",
      mesh: null,
      img: './img/2banan2.png'
    },
    {
      obj: "./models/3densan.obj",
      mtl: "./models/3densan.mtl",
      texture: "./models/texture/white.jpg",
      mesh: null,
      img: './img/3densan.png'
    },
    {
      obj: "./models/4decor1.obj",
      mtl: "./models/4decor1.mtl",
      texture: "./models/texture/table1.jpg",
      mesh: null,
      img: './img/4decor1.png'
    },
    {
      obj: "./models/5decor2.obj",
      mtl: "./models/5decor2.mtl",
      texture: "./models/texture/table1.jpg",
      mesh: null,
      img: './img/5decor2.png'
    },
    {
      obj: "./models/6ghean1.obj",
      mtl: "./models/6ghean1.mtl",
      texture: "./models/texture/table1.jpg",
      mesh: null,
      img: './img/6ghean1.png'
    },
    {
      obj: "./models/10ghedau.obj",
      mtl: "./models/10ghedau.mtl",
      texture: "./models/texture/sofa1.jpg",
      mesh: null,
      img: './img/10ghedau.png'
    },
    {
      obj: "./models/11ketv.obj",
      mtl: "./models/11ketv.mtl",
      texture: "./models/texture/wall1.jpg",
      mesh: null,
      img: './img/11ketv.png'
    },
    {
      obj: "./models/12sofa.obj",
      mtl: "./models/12sofa.mtl",
      texture: "./models/texture/sofa1.jpg",
      mesh: null,
      img: './img/12sofa.png'
    },
    {
      obj: "./models/13tham.obj",
      mtl: "./models/13tham.mtl",
      texture: "./models/texture/tham2.jpg",
      mesh: null,
      img: './img/13tham.png'
    },
    {
      obj: "./models/14tv.obj",
      mtl: "./models/14tv.mtl",
      texture: "./models/texture/sofa2.jpg",
      mesh: null,
      img: './img/14tv.png'
    },
  ];

const MODELS_ADD_KEY = 'MODELS_ADD_KEY';
  
localStorage.setItem(MODELS_ADD_KEY, JSON.stringify(modelsAdd));