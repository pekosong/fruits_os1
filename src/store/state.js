const items = {
  vegetables: [{
      id: 1,
      name: "감자",
      ename: "potato",
      img: "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_d35d7ad7-6230-41e2-95ab-0a5b9a1b80d0.jpg"
    },
    {
      id: 2,
      name: "양파",
      ename: "onion",
      img: "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_c52783e5-46ee-4c38-b0a0-6e792b9fe497.jpg"
    },
    {
      id: 3,
      name: "피망",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_de08d850-94fe-4901-a562-8f9a764c48eb.jpg"
    },
    {
      id: 4,
      name: "브로콜리",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_09a00d67-c8d6-4fac-9b86-e3b137c924a0.jpg"
    },
    {
      id: 5,
      name: "샐러리",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_ecd43712-2b83-4e7f-aa0b-af7f24a7b28e.jpg"
    },
    {
      id: 6,
      name: "당근",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_25ccf4fc-4f29-4642-97d2-ed1955c6d440.jpg"
    },
    {
      id: 7,
      name: "애호박",
      ename: "",
      img: "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_878dc704-552d-43b1-b30d-6d0470c7e66d.jpg"
    },
    {
      id: 8,
      name: "Green Beans",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_401558f8-255f-4584-ad12-fdcc16c2ecd9.jpg"
    },
    {
      id: 9,
      name: "아스파라거스",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_60576c7b-67a8-4d73-809c-0119f6ddc342.jpg"
    },
    {
      id: 10,
      name: "Cauliflower",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_c876cbb8-a9c0-441b-8c30-87be44922e04.jpg"
    },
    {
      id: 11,
      name: "대파",
      ename: "",
      img: "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_4fd69247-e19d-45d2-9308-2efda8fda2a4.jpg"
    }
  ],
  fruits: [{
      id: 0,
      name: "과일분류",
      ename: "fruits",
      img: "http://cdn.24.co.za/files/Cms/General/d/7635/c9cb6d629e5e40318d2b120ed91c9b2b.png"
    },
    {
      id: 1,
      name: "사과",
      ename: "apple",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_09c1a101-671d-4bad-911a-48a556c15906.jpg"
    },
    {
      id: 2,
      name: "오렌지",
      ename: "orange",
      img: "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_9fa00eb7-1e12-45d7-8716-cd530fc487ac.jpg"
    },
    {
      id: 3,
      name: "토마토",
      ename: "tomato",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/600x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_55cedb7b-64c9-4c6c-b203-6d70b99eac38.jpg"
    },
    {
      id: 4,
      name: "바나나",
      ename: "banana",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_b6eaf3fa-b20e-45c7-ade1-560e662fc33f.jpg"
    },
    {
      id: 5,
      name: "딸기",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_d80adcd7-fbc0-419c-b9f2-c2dfe1da84d1.jpg"
    },
    {
      id: 6,
      name: "메론",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_05864a94-cc23-4e66-abd3-0588d343e708.jpg"
    },
    {
      id: 7,
      name: "귤",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_25be7bb2-e9e8-44bb-a338-60d54ec82e30.jpg"
    },
    {
      id: 8,
      name: "풋사과",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_63fd0746-73e7-40e3-b45c-d3a3ae362447.jpg"
    },
    {
      id: 9,
      name: "아보카도",
      ename: "",
      img: "https://d2d8wwwkmhfcva.cloudfront.net/900x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_1aea0e10-1ec5-4247-a64b-601cdcf79099.jpg"
    },
    {
      id: 10,
      name: "복숭아",
      ename: "",
      img: "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_c2a71955-6f56-47ec-9dd7-7788474ce338.jpg"
    },
    {
      id: 11,
      name: "수박",
      ename: "",
      img: "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_4f79ab8d-3485-4fee-8e94-1597ecf719c8.jpg"
    },
    {
      id: 12,
      name: "감",
      ename: "",
      img: "https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_aeb3ab92-fd79-42f1-890f-9a84b726777c.jpg"
    }
  ]
}

export default {
  items
}