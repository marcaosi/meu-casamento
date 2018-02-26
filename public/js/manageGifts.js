$(".element-dropdown").hide()
$("#dropdown-arrow-up").hide()
$(".link-dropdown").on('click', function(event) {
    event.preventDefault()

    let id = $(this).data("target")
    let elementDropdown = $("#"+id)
    let dropdownArrow = $("#dropdownArrow")

    if(elementDropdown.data("visible") === 'hide'){
        elementDropdown.fadeIn(500, () => {
            $("#dropdown-arrow-down").hide()
            $("#dropdown-arrow-up").show()
        })
        elementDropdown.data("visible", "show") 
    }else{
        elementDropdown.fadeOut(500, () => {
            $("#dropdown-arrow-down").show()
            $("#dropdown-arrow-up").hide()
        })
        elementDropdown.data("visible", "hide") 
    }
})