import requests
from bs4 import BeautifulSoup

def animalpage(url: str, soup: BeautifulSoup):
    # URL = "https://www.kindernetz.de/wissen/tierlexikon/saeugetiere-von-a-z-102~_page7569000920814668410-F_-33a4db36e411728d53ce0928b464460cb9e90957.html"
    if soup == None:
        page = requests.get(url)
        soup = BeautifulSoup(page.content, "html.parser")
    # find links with title attribute regex "Steckbrief - .*"

    links = soup.find_all("a", class_="teasertracking clickzone", title=lambda x: x and x.startswith("Steckbrief - "))

    tiere = []

    for link in links:
        tier = link['title'].split("Steckbrief - ")[1]
        if tier not in tiere:
            tiere.append(tier)
    return tiere

def speciespage(url: str, baseURL: str):
    page = requests.get(url)
    
    soup = BeautifulSoup(page.content, "html.parser")
    
    tiere = animalpage("", soup)
    
    list = soup.find("ul", class_="pagination abisz-leiste")
    
    if list == None:
        return tiere

    links = list.find_all("a")
    visited_links = set()
    
    for link in links:
        if link['href'] != "#":
            if link['href'] in visited_links:
                continue
            print("Scraping " + link.text + "...")
            visited_links.add(link['href'])
            tiere += animalpage(baseURL + link['href'], None)
    
    return tiere

def speciespages(url: str, baseURL: str):
    page = requests.get(url)
    
    soup = BeautifulSoup(page.content, "html.parser")

    links = soup.find_all("a", class_="teasertracking clickzone", title=lambda x: x and x.endswith(" von A-Z"))
    
    arten = {}
    visited_links = set()
    
    for link in links:
        if link['href'] in visited_links:
            continue
        art = link['title'].split(" von A-Z")[0]
        print("Scraping " + art + "...")
        visited_links.add(link['href'])
        arten[art] = speciespage(baseURL + link['href'], baseURL)
    
    return arten

# print(speciespages("https://www.kindernetz.de/wissen/tierlexikon/tiere-von-a-z-100.html", baseURL="https://www.kindernetz.de"))


# Event parser

from icalendar import Calendar, vDatetime
import requests

url = "https://online.rwth-aachen.de/RWTHonlinej/ws/termin/ical?pStud=3F818696579D15EB&pToken=D390D4E7F35DF0F9E31C1C28437838D18A48426ED6FBD2C6DAF9319161CB381F"
txt = requests.get(url).text

c = Calendar.from_ical(txt)

list = []

for event in c.walk("VEVENT"):
    name = event.get("SUMMARY")
    if "lineare algebra" in name.lower():
        start = event.get("DTSTART")
        end = event.get("DTEND")
        # "2024-07-11 10:30:00+00:00" into "2022-01-01 00:00:00.000Z" format
        start = start.dt.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3] + "Z"
        end = end.dt.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3] + "Z"
        print(name, start, end)
        list.append("{\"start\": \"%s\", \"end\": \"%s\"}" % (start, end))
        
print(list)