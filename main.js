import querystring from "querystring"
import Crawler from "crawler"
import config from "./config"
import printJson from "./lib/print-json"

const HOST = config.host
const MAX_PAGE = config.listCrawler.maxPage

export default async function main() {
  try {
    /**
     * 열려라 국회 의원 조회 페이지에서 각 페이지 별로 의원별 URL을 수집한다
     */
    const listCrawler = new Crawler({
      maxConnections: config.listCrawler.maxConnections,
      rateLimit: config.listCrawler.rateLimit,
      callback: async (error, res, done) => {
        if (error) {
          console.log(error)
        } else {
          const $ = res.$

          // <head> 내에서 현재 페이지 정보 획득
          const page =
            getDataFromUrlQueryString(
              $('head > meta[property="og:url"]').prop("content"),
              "page"
            ) || 1

          // 국회의원 목록을 순차적으로 돌면서
          // URL을 획득하여 국회의원 별 세부 정보를 가져오는 크롤러 등록
          $("#content .col-xs-6.col-sm-3.col-md-2").each((i, elem) => {
            const link = $(elem)
              .children()
              .children()
              .prop("href")

            detailCrawler.queue(`${HOST}${link}`)
          })

          console.log(`⛹️‍♂️ ${page} 페이지 조회 완료 ‍⛹️‍♂️`)
        }

        done()
      }
    })

    /**
     * 위 List Crawer 로부터 수집된 URL 별로
     * 국회의원 세부 정보를 가져오는 크롤
     */
    const detailCrawler = new Crawler({
      maxConnections: config.detailCrawer.maxConnections,
      rateLimit: config.detailCrawer.rateLimit,
      callback: async (error, res, done) => {
        const person = {}

        if (error) {
          console.error(error)
        } else {
          const $ = res.$

          // 국회 차수
          person.turn = 20
          // 열려라 국회 ID
          person.watchId = getMemberIdFromUrl(
            $('head > meta[property="og:url"]').prop("content")
          )

          // 이름
          const name = $(".panel-body > h1")
            .text()
            .trim()
            .split(" ")
          person.nameKo = name[0]
          person.nameHj = name[2]

          // 프로필 이미지 주소
          person.profileImage = $("#content img.m_pic").prop("src")

          $("table.table-user-information tbody > tr").each((i, elem) => {
            const value = $(elem)
              .children()
              .last()
              .text()

            switch (i) {
              case 0:
                // 정당
                person.party = value.trim().slice(1)
                break
              case 1:
                // 선거구
                person.eletoralDistrict = value.trim()
                break
              case 2:
                // 당선 횟수
                person.reeleGbnNm = Number(value.trim())
                // console.log('당선횟수: ', value.trim())
                break
              case 3:
                // 상임위원회
                person.departments = ""
                $(elem)
                  .children()
                  .last()
                  .children("a")
                  .each((subI, subElem) => {
                    person.departments +=
                      getDataFromUrlQueryString(
                        $(subElem).prop("href"),
                        "sangim"
                      ) + "\n"
                  })
                person.departments = person.departments.slice(0, -1)
                break
              case 4:
                // 학력
                person.education = value.trim()
                break
              case 5:
                // 경력
                person.career = value.trim()
                break
              case 6:
                // 연락처
                person.contact = value.trim()
                // console.log('연락처: ', value.trim())
                break
              case 7:
                // 이메일
                person.email = value.trim()
                // console.log('이메일: ', value.trim())
                break
              default:
                // 기타
                break
            }
          })

          if (person.watchId) {
            console.log("===================================")
            console.log(`🕵️‍♀️ ${person.nameKo} 완료되었습니다. 🕵️‍♂️`)
            console.log("-----------------------------------")
            printJson(person)
            console.log("===================================")
            console.log("")
          } else {
            console.log("WATCH ID가 없는 인물")
            printJson(person)
          }
        }

        done()
      }
    })

    /**
     * 국회의원 조회 페이지에서 원하는 페이지까지 반복하여
     * List Crawler에 등록
     */
    for (let i = 0; i < MAX_PAGE; i++) {
      listCrawler.queue(
        `${HOST}/?act=&mid=AssemblyMembers&vid=&mode=search&name=&party=&region=&sangim=&gender=&age=&elect_num=&singlebutton=&page=${i +
          1}`
      )
    }
  } catch (err) {
    console.error(err)
  }
}

function getMemberIdFromUrl(url) {
  return getDataFromUrlQueryString(url, "member_seq")
}

function getDataFromUrlQueryString(url, key = "") {
  if (!key) {
    return ""
  } else {
    return querystring.parse(url)[key]
  }
}
