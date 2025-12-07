// Sayfa yüklenince çalışacak ana kurulum
document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll('.course input[type="checkbox"]');

  // Kayıtlı durumları geri yükle ve event bağla
  checkboxes.forEach((checkbox) => {
    restoreCheckboxState(checkbox);
    checkbox.addEventListener("change", handleCheckboxChange);
  });

  // Başlangıçta tüm ilerlemeleri hesapla
  updateAllCourseProgress();
  updateAllOverallProgress();
});

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const courseElement = checkbox.closest(".course");
  if (!courseElement) return;

  persistCheckboxState(checkbox);
  updateCourseProgress(courseElement);
  updateAllOverallProgress();
}

function restoreCheckboxState(checkbox) {
  const courseKey = checkbox.getAttribute("data-course");
  const topicId = checkbox.getAttribute("data-topic-id");
  const storageKey = makeStorageKey(courseKey, topicId);
  const savedValue = localStorage.getItem(storageKey);

  checkbox.checked = savedValue === "1";
}

function persistCheckboxState(checkbox) {
  const courseKey = checkbox.getAttribute("data-course");
  const topicId = checkbox.getAttribute("data-topic-id");
  const storageKey = makeStorageKey(courseKey, topicId);

  localStorage.setItem(storageKey, checkbox.checked ? "1" : "0");
}

// localStorage key üretmek için yardımcı fonksiyon
function makeStorageKey(courseKey, topicId) {
  return "progress_" + courseKey + "_" + topicId;
}

// Her ders için checkbox'lara göre yüzdelik ve kaç/kaç hesapla
function updateCourseProgress(courseElement) {
  const checkboxes = courseElement.querySelectorAll('input[type="checkbox"]');
  const total = checkboxes.length;
  if (total === 0) return;

  let done = 0;
  checkboxes.forEach((cb) => {
    if (cb.checked) done++;
  });

  const percent = Math.round((done / total) * 100);

  const fill = courseElement.querySelector(".progress-fill");
  const text = courseElement.querySelector(".progress-text");
  const countText = courseElement.querySelector(".course-count-text");

  if (fill) fill.style.width = percent + "%";
  if (text) text.textContent = percent + "%";
  if (countText) countText.textContent = `${done} / ${total} konu tamamlandı`;
}

// TYT ve AYT için genel bar
function updateOverallProgress(level) {
  const allCourses = document.querySelectorAll(`.course[data-course^="${level}-"]`);
  if (allCourses.length === 0) return;

  let totalTopics = 0;
  let doneTopics = 0;

  allCourses.forEach((course) => {
    const checkboxes = course.querySelectorAll('input[type="checkbox"]');
    totalTopics += checkboxes.length;
    checkboxes.forEach((cb) => {
      if (cb.checked) doneTopics++;
    });
  });

  if (totalTopics === 0) return;

  const percent = Math.round((doneTopics / totalTopics) * 100);

  const overallEl = document.querySelector(`.overall-block[data-overall="${level}"]`);
  if (!overallEl) return;

  const fill = overallEl.querySelector(".progress-fill");
  const text = overallEl.querySelector(".progress-text");
  const countText = overallEl.querySelector(".overall-count-text");

  if (fill) fill.style.width = percent + "%";
  if (text) text.textContent = percent + "%";
  if (countText) countText.textContent = `${doneTopics} / ${totalTopics} konu tamamlandı`;
}

function updateAllCourseProgress() {
  const courses = document.querySelectorAll(".course");
  courses.forEach((course) => updateCourseProgress(course));
}

function updateAllOverallProgress() {
  updateOverallProgress("tyt");
  updateOverallProgress("ayt");
}