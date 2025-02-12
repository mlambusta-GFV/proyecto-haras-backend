import {TestBucket} from "./TestBucket";
import {People} from "../src/Peoples/People";
import {Location} from "../src/Locations/Location";
import {Horse} from "../src/Horse/Horse";
import {Post} from "../src/Post";

const chai = require("chai")
const expect = chai.expect
const assert = require("assert");
chai.use(require("chai-as-promised"))

describe("Horse Test", ()=> {
    const testBucket = new TestBucket()

    it("1", function () {
        const luisGonzalez = People.named(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const location = Location.initialize(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const tornado = Horse.named(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, location, locationDate, TestBucket.TORNADO_DATE_BIRTH, TestBucket.TORNADO_VETERINARIAN, undefined, undefined, undefined, observation, undefined, stock, undefined, undefined, undefined, status)

        const title =  "New title"
        const type  = "type1"
        const author = "Juan Perez"
        const subtitle = "Subtitle"
        const content = "Content"
        const date = new Date()
        const status = "Status1"
        const epigraph = "Epigraph"
        const slug = "Slug"
        const tags = "tags"

        const newPost = Post.initialize(title, type, author, subtitle, content, date, status, epigraph, slug, tags, tornado)

        expect(newPost.isTitle(title)).to.ok
        expect(newPost.isType(type)).to.ok
        expect(newPost.isAuthor(author)).to.ok
        expect(newPost.isSubtitle(subtitle)).to.ok
        expect(newPost.isContent(content)).to.ok
        expect(newPost.isDate(date)).to.ok
        expect(newPost.isStatus(status)).to.ok
        expect(newPost.isEpigraph(epigraph)).to.ok
        expect(newPost.isSlug(slug)).to.ok
        expect(newPost.isTags(tags)).to.ok
        expect(newPost.isHorse(tornado)).to.ok
    });

    it("Crate Post with all parameters", function () {
        const luisGonzalez = People.named(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const location = Location.initialize(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)

        const tornado = Horse.named(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, location, locationDate, TestBucket.TORNADO_DATE_BIRTH, TestBucket.TORNADO_VETERINARIAN, undefined, undefined, undefined, observation, undefined, stock, undefined, undefined, undefined, status)
        const title =  "New title"
        const type  = ""
        const author = ""
        const subtitle = ""
        const content = ""
        const date = new Date()
        const status = ""
        const epigraph = ""
        const slug = "Slug"
        const tags = ""

        const newPost = Post.initialize(title, type, author, subtitle, content, date, status, epigraph, slug, tags, tornado)

        expect(newPost.isTitle(title)).to.ok
        expect(newPost.isType(type)).to.ok
        expect(newPost.isAuthor(author)).to.ok
        expect(newPost.isSubtitle(subtitle)).to.ok
        expect(newPost.isContent(content)).to.ok
        expect(newPost.isDate(date)).to.ok
        expect(newPost.isStatus(status)).to.ok
        expect(newPost.isEpigraph(epigraph)).to.ok
        expect(newPost.isSlug(slug)).to.ok
        expect(newPost.isTags(tags)).to.ok
        expect(newPost.isHorse(tornado)).to.ok
    });

    it("2", function () {
        const luisGonzalez = People.named(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const location = Location.initialize(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)

        const tornado = Horse.named(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, location, locationDate, TestBucket.TORNADO_DATE_BIRTH, TestBucket.TORNADO_VETERINARIAN, undefined, undefined, undefined, observation, undefined, stock, undefined, undefined, undefined, status)
        const title =  "New title"
        const type: string = undefined
        const author = ""
        const subtitle = ""
        const content = ""
        const date = new Date()
        const status = ""
        const epigraph = ""
        const slug = "Slug"
        const tags = ""


        const newPost = Post.initialize(title, type, author, subtitle, content, date, status, epigraph, slug, tags, tornado)

        expect(newPost.isTitle(title)).to.ok
        expect(newPost.isType(type)).to.ok
        expect(newPost.isAuthor(author)).to.ok
        expect(newPost.isSubtitle(subtitle)).to.ok
        expect(newPost.isContent(content)).to.ok
        expect(newPost.isDate(date)).to.ok
        expect(newPost.isStatus(status)).to.ok
        expect(newPost.isEpigraph(epigraph)).to.ok
        expect(newPost.isSlug(slug)).to.ok
        expect(newPost.isTags(tags)).to.ok
        expect(newPost.isHorse(tornado)).to.ok
    });
})