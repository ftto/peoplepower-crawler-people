# 열려라 국회 크롤러 - 현역 국회의원 정보

[FTTO](https://ftto.kr)에서 [국회의원 감시하기](https://gookgam.com)를 개발하기 위해 사용한 크롤러 소스코드

## 순서

1. [열려라 국회의 의원 전체 조회 페이지](http://watch.peoplepower21.org/?act=&mid=AssemblyMembers&vid=&mode=search&name=&party=&region=&sangim=&gender=&age=&elect_num=&singlebutton=)에서 각 국회의원별 세부 페이지 URL 을 수집한다.

2. 수집된 세부 URL 을 돌면서 각 의원 별 세부 정보를 가져온다

## Tips

- `src/config.js` 파일에서 크롤러가 동작하는 성능/속도와 관련된 설정을 수정할 수 있다. 너무 빠르게 동작하도록 설정했다가는 열려라 국회 쪽 사이트에 접근이 막힐 수 있으니 적절한 값으로 동작하는 것이 좋다.

## Developed By

[FTTO](https://ftto.kr)

## License

[MIT](LICENSE)
