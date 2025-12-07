// Her şey yüklendikten sonra çalışsın
document.addEventListener("DOMContentLoaded", function () {
  const courses = document.querySelectorAll(".course");
  const checkboxes = document.querySelectorAll('input[type="checkbox"][data-course]');

  // Sayfa açılınca daha önce işaretlenenleri localStorage'dan yükle
  checkboxes.forEach((checkbox) => {
    const courseKey = checkbox.getAttribute("data-course");
    const topicId = checkbox.getAttribute("data-topic-id");
    const storageKey = makeStorageKey(courseKey, topicId);
    const savedValue = localStorage.getItem(storageKey);

    if (savedValue === "1") {
      checkbox.checked = true;
    }

    // Değişince kaydet + ilgili dersin ve genel ilerlemenin yüzdesini güncelle
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        localStorage.setItem(storageKey, "1");
      } else {
        localStorage.setItem(storageKey, "0");
      }
      updateCourseProgress(findCourseElement(courseKey));
      updateOverallProgress("tyt");
      updateOverallProgress("ayt");
    });
  });

  // Sayfa açılır açılmaz bütün derslerin barını hesapla
  courses.forEach((courseEl) => {
    updateCourseProgress(courseEl);
  });

  // Genel TYT & AYT barlarını da hesapla
  updateOverallProgress("tyt");
  updateOverallProgress("ayt");
});

// localStorage key üretmek için yardımcı fonksiyon
function makeStorageKey(courseKey, topicId) {
  return "progress_" + courseKey + "_" + topicId;
}

// data-course'a göre ilgili .course bölümünü bul
function findCourseElement(courseKey) {
  return document.querySelector('.course[data-course="' + courseKey + '"]');
}

// Bir dersin içindeki checkbox'lara göre yüzdelik ve kaç/kaç hesapla
function updateCourseProgress(courseElement) {
  if (!courseElement) return;

  const checkboxes = courseElement.querySelectorAll('input[type="checkbox"][data-course]');
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

  if (fill) {
    fill.style.width = percent + "%";
  }
  if (text) {
    text.textContent = percent + "%";
  }
  if (countText) {
    countText.textContent = done + " / " + total + " konu tamamlandı";
  }
}

// TYT ve AYT için genel bar
function updateOverallProgress(level) {
  // level: "tyt" veya "ayt"
  const allCourses = document.querySelectorAll('.course[data-course^="' + level + '-"]');
  if (!allCourses || allCourses.length === 0) return;

  let totalTopics = 0;
  let doneTopics = 0;

  allCourses.forEach((course) => {
    const checkboxes = course.querySelectorAll('input[type="checkbox"][data-course]');
    totalTopics += checkboxes.length;
    checkboxes.forEach((cb) => {
      if (cb.checked) doneTopics++;
    });
  });

  if (totalTopics === 0) return;

  const percent = Math.round((doneTopics / totalTopics) * 100);

  const overallEl = document.querySelector('.overall-block[data-overall="' + level + '"]');
  if (!overallEl) return;

  const fill = overallEl.querySelector(".progress-fill");
  const text = overallEl.querySelector(".progress-text");
  const countText = overallEl.querySelector(".overall-count-text");

  if (fill) {
    fill.style.width = percent + "%";
  }
  if (text) {
    text.textContent = percent + "%";
  }
  if (countText) {
    countText.textContent = doneTopics + " / " + totalTopics + " konu tamamlandı";
  }
}
