function createOrbit(index: number): HTMLSpanElement {
  const orbit = document.createElement("span")
  const isSignal = index % 2 === 1
  orbit.className = `ark-orbit ark-orbit-css ${isSignal ? "ark-orbit-signal" : "ark-orbit-eclipse"}`
  orbit.setAttribute("aria-hidden", "true")

  orbit.innerHTML = [
    '<span class="ark-planet"></span>',
    '<span class="ark-ring ark-ring-one"><i></i></span>',
    '<span class="ark-ring ark-ring-two"><i></i></span>',
    isSignal ? '<span class="ark-scan"></span>' : "",
  ].join("")

  return orbit
}

function displayTitle(title: string): string {
  return title.replace(/^\d+(?:,\d+)?\s*-\s*/, "").trim()
}

function createCard(source: HTMLAnchorElement, index: number): HTMLAnchorElement {
  const title = source.textContent?.trim() || "Untitled"
  const card = document.createElement("a")
  card.className = "ark-collection-card internal internal-link"
  card.href = source.getAttribute("href") ?? source.href
  card.dataset.noPopover = "true"
  card.setAttribute("aria-label", title)

  const code = document.createElement("span")
  code.className = "ark-card-code"
  code.textContent = title.toUpperCase()

  const name = document.createElement("strong")
  name.textContent = displayTitle(title)

  const description = document.createElement("span")
  description.className = "ark-card-description"

  card.append(code, createOrbit(index), name, description)
  return card
}

function renderAutomaticFolderCards() {
  const listings = document.querySelectorAll<HTMLElement>("article.ark-folder-page + .page-listing")

  for (const listing of listings) {
    if (listing.dataset.arkCards === "ready") continue

    const list = listing.querySelector<HTMLUListElement>("ul.section-ul")
    if (!list) continue

    const links = Array.from(list.querySelectorAll<HTMLAnchorElement>("li.section-li .desc h3 > a"))
    if (links.length === 0) continue

    list.classList.add("ark-card-grid", "ark-auto-card-grid")
    links.forEach((link, index) => {
      const item = link.closest<HTMLLIElement>("li.section-li")
      if (!item) return
      item.className = "ark-auto-card-item"
      item.replaceChildren(createCard(link, index))
    })

    const count = listing.querySelector(":scope > p")
    count?.remove()
    listing.classList.add("ark-auto-listing")
    listing.dataset.arkCards = "ready"
  }
}

renderAutomaticFolderCards()
document.addEventListener("nav", renderAutomaticFolderCards)
