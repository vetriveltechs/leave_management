<?php
/************************************
 * Author      : Vetri
 * Created By  : Vetri
 * Created On  : 29-Oct-2024 
*************************************/
?>
<script>

    function sectionShow(section_type,show_hide_type)
    {	
        if(section_type == 'FIRST_SECTION')
        {
            if(show_hide_type == 'SHOW')
            {
                $(".first_sec_hide").hide();
                $(".first_sec_show").show();

                $(".first_section").hide("slow");
            }
            else if(show_hide_type == 'HIDE')
            {
                $(".first_sec_hide").show();
                $(".first_sec_show").hide();

                $(".first_section").show("slow");
            }
        }
        else if(section_type == 'SECOND_SECTION')
        {
            if(show_hide_type == 'SHOW')
            {
                $(".sec_sec_hide").hide();
                $(".sec_sec_show").show();

                $(".sec_section").hide("slow");
            }
            else if(show_hide_type == 'HIDE')
            {
                $(".sec_sec_hide").show();
                $(".sec_sec_show").hide();

                $(".sec_section").show("slow");
            }
        }
        else if(section_type == 'THIRD_SECTION')
        {
            if(show_hide_type == 'SHOW')
            {
                $(".thi_sec_hide").hide();
                $(".thi_sec_show").show();

                $(".thi_section").hide("slow");
            }
            else if(show_hide_type == 'HIDE')
            {
                $(".thi_sec_hide").show();
                $(".thi_sec_show").hide();

                $(".thi_section").show("slow");
            }
        }
        else if(section_type == 'FOURTH_SECTION')
        {
            if(show_hide_type == 'SHOW')
            {
                $(".fou_sec_hide").hide();
                $(".fou_sec_show").show();

                $(".fou_section").hide("slow");
            }
            else if(show_hide_type == 'HIDE')
            {
                $(".fou_sec_hide").show();
                $(".fou_sec_show").hide();

                $(".fou_section").show("slow");
            }
        }
    }


    $(document).ready(function()
    {  
        $('#industries_name').keyup(function()
        {  
            var industries_name   = $('#industries_name').val();  

            if(industries_name != '')  
            {  
                $.ajax({  
                    url:"<?php echo base_url();?>industries/ajaxIndustriesListAll",  
                    method:"POST",  
                    data:{industries_name:industries_name},
                    success:function(data)  
                    {  
                        $('#IndustriesNameList').fadeIn();  
                        $('#IndustriesNameList').html(data);  
                    }  
                });  
            }
            else
            {
                $(".industries_name_clear_icon").hide();
                $("#industries_id").val("");
                $("#industries_name").val("");
                $('#IndustriesNameList').fadeOut();  
            }    
        });

        $(document).on('click', 'ul.list-unstyled-industries_id li', function()
        {  
            var value = $(this).text();
            
            if(value === "No data found.")
            {
                $('#IndustriesNameList').fadeOut();
            }
            else
            {
                $('#IndustriesNameList').fadeOut();  
            }
        });
    });

   
    function getIndustriesList(industries_id,industries_code,industries_name)
    {
        $('.industries_name_clear_icon').show();
        if(industries_id == 0)	
        {
            $('#industries_id').val('0');
        }
        else
        {
            $('#industries_id').val(industries_id);
            $('#industries_name').val(industries_code + '-' + industries_name);
        }
    }

    function clearIndustriesNameSearchKeyword()
    {
        $(".industries_name_clear_icon").hide();
        $("#industries_id").val("");
        $("#industries_name").val("");
	}



    $(document).ready(function()
    {  
        $('#product_name').keyup(function()
        {  
            var product_name   = $('#product_name').val();  

            if(product_name != '')  
            {  
                $.ajax({  
                    url:"<?php echo base_url();?>products/ajaxProductListAll",  
                    method:"POST",  
                    data:{product_name:product_name},
                    success:function(data)  
                    {  
                        $('#ProductNameList').fadeIn();  
                        $('#ProductNameList').html(data);  
                    }  
                });  
            }
            else
            {
                $(".product_name_clear_icon").hide();
                $("#product_id").val("");
                $("#product_name").val("");
                $('#ProductNameList').fadeOut();  
            }    
        });

        $(document).on('click', 'ul.list-unstyled-product_id li', function()
        {  
            var value = $(this).text();
            
            if(value === "No data found.")
            {
                $('#ProductNameList').fadeOut();
            }
            else
            {
                $('#ProductNameList').fadeOut();  
            }
        });
    });

   
    function getProductList(product_id,product_name)
    {
        $('.product_name_clear_icon').show();
        if(product_id == 0)	
        {
            $('#product_id').val('0');
        }
        else
        {
            $('#product_id').val(product_id);
            $('#product_name').val(product_name);
        }
    }

    function clearProductNameSearchKeyword()
    {
        $(".product_name_clear_icon").hide();
        $("#product_id").val("");
        $("#product_name").val("");
	}

    function validateImage(input) 
    {
        var file = input.files[0]; // Get the selected file
        var allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed image types

        if (file) 
        {
            if (!allowedTypes.includes(file.type)) 
            {
                alert('Only JPG, PNG, and GIF images are allowed.');
                input.value = ''; // Clear the input field
                return;
            }

            const maxSize = 10 * 1024 * 1024; // 10MB size limit
            if (file.size > maxSize) {
                alert('File size must be less than 10MB.');
                input.value = ''; // Clear the input field
                return;
            }
        }
    }
    
    
  
        $(document).ready(function() {
            // Sanitize spaces for input and textarea fields
            $('input[type="text"], input[type="search"], input[type="email"],input[type="number"], textarea').on('input', function() {
                let value = $(this).val();

                // Remove leading spaces only
                value = value.replace(/^\s+/g, '');

                // Replace multiple consecutive spaces with a single space
                value = value.replace(/\s+/g, ' ');

                // Set the sanitized value back to the field
                $(this).val(value);
            });

            // Apply sanitization for CKEditor content
            if (typeof CKEDITOR !== 'undefined') {
                CKEDITOR.on('instanceReady', function(event) {
                    const editorInstance = event.editor;

                    // Listen for changes in CKEditor content
                    editorInstance.on('change', function() {
                        let content = editorInstance.getData();

                        // Remove initial spaces
                        content = content.replace(/^\s+/g, '');

                        // Replace multiple consecutive spaces with a single space
                        content = content.replace(/\s{2,}/g, ' ');

                        // Update the cleaned content back to CKEditor without moving the cursor
                        editorInstance.setData(content, function() {
                            editorInstance.updateElement();  // Ensures textarea reflects changes
                        });
                    });
                });
            }
        });


        
    </script>    
