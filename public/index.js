let navigation_show = true;

$(".toggle-nav-button").click(function () {
  if (navigation_show) {
    $("#navigation").animate({ right: "-240px" });
    navigation_show = false;
  } else {
    $("#navigation").animate({ right: "0" });
    navigation_show = true;
  }
});

if (window.innerWidth <= 768) {
  $(".q-link").click(function () {
    $("#navigation").animate({ right: "-240px" });
    navigation_show = false;
  });
}

$(".radio-input").click(function (e) {
  const targetId = e.target.id;
  $("#a" + targetId).css("background-color", "blue");
});
