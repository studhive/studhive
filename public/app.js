(() => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  const closeMenu = () => {
    menu?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("is-open");
  };
  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-wrap")) closeMenu();
  });
  matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const buttons = [...group.querySelectorAll("[data-filter]")];
    const cards = [
      ...group.parentElement.querySelectorAll(".filter-grid > [data-category]"),
    ];
    const status = group.parentElement.querySelector(".filter-status");
    const filter = (value) => {
      buttons.forEach((button) => {
        const active = button.dataset.filter === value;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      let count = 0;
      cards.forEach((card) => {
        const visible =
          value === "all" || card.dataset.category.split(" ").includes(value);
        card.hidden = !visible;
        if (visible) count++;
      });
      if (status) {
        const noun =
          group.dataset.filterGroup === "programmes"
            ? count === 1
              ? "programme"
              : "programmes"
            : count === 1
              ? "story"
              : "stories";
        status.textContent = `${count} ${noun} shown.`;
      }
    };
    buttons.forEach((button) =>
      button.addEventListener("click", () => {
        filter(button.dataset.filter);
        const url = new URL(location.href);
        const key =
          group.dataset.filterGroup === "programmes" ? "pillar" : "category";
        if (button.dataset.filter === "all") url.searchParams.delete(key);
        else url.searchParams.set(key, button.dataset.filter);
        history.replaceState(null, "", url);
      }),
    );
    const selected = new URLSearchParams(location.search).get(
      group.dataset.filterGroup === "programmes" ? "pillar" : "category",
    );
    if (
      selected &&
      buttons.some((button) => button.dataset.filter === selected)
    )
      filter(selected);
    else filter("all");
  });

  const dialog = document.querySelector("#application-dialog");
  document.querySelectorAll("[data-apply]").forEach((button) =>
    button.addEventListener("click", () => {
      dialog.showModal();
      document.body.classList.add("dialog-open");
    }),
  );
  dialog
    ?.querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    const r = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom)
    )
      dialog.close();
  });
  dialog?.addEventListener("close", () =>
    document.body.classList.remove("dialog-open"),
  );

  const form = document.querySelector("#contact-form");
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const interest = form.querySelector("#interest");
  if (
    [...interest.options].some(
      (option) => option.value === params.get("interest"),
    )
  )
    interest.value = params.get("interest");
  let draft = "";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const topic = interest.selectedOptions[0].textContent;
    draft = `Enquiry for Students’ Hive (Studhive)\n\nFrom: ${data.get("name")}\nEmail: ${data.get("email")}\nSchool / organisation: ${data.get("organisation") || "Not specified"}\nTopic: ${topic}\n\n${data.get("message")}\n`;
    const result = document.querySelector("#form-result");
    document.querySelector("#form-result-title").textContent =
      "Your message draft is ready.";
    document.querySelector("#form-result-text").textContent = form.dataset.email
      ? "Open the draft in your email app, review it and choose Send there. You can also download a copy."
      : "Nothing has been sent. Message delivery is not connected yet. Download your draft to keep a copy for later.";
    result.hidden = false;
    let mailLink = result.querySelector(".email-draft");
    if (form.dataset.email) {
      if (!mailLink) {
        mailLink = document.createElement("a");
        mailLink.className = "text-link email-draft";
        mailLink.textContent = "Open email draft";
        result.appendChild(mailLink);
      }
      mailLink.href = `mailto:${encodeURIComponent(form.dataset.email)}?subject=${encodeURIComponent("Studhive enquiry: " + topic)}&body=${encodeURIComponent(draft)}`;
    }
    result.focus();
  });
  form.addEventListener("input", () => {
    document.querySelector("#form-result").hidden = true;
    draft = "";
  });
  document.querySelector("#download-message").addEventListener("click", () => {
    if (!draft) return;
    const url = URL.createObjectURL(
      new Blob([draft], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "studhive-enquiry-draft.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
