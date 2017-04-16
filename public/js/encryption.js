var Gallery = new Vue({
    el: '#gallery',
    data: {
        loading: false,
        pictures: {
            original: "",
            containers: []
        },
        picture: {
            base64Picture: "",
            bytes: null
        },
        methods: [],
        analyseUrl: "",
        errors: []
    },
    mounted: function () {
        this.analyseUrl = analyseUrl;
    },
    methods: {
        copyPicture: function () {
            var copiedPicture = jQuery.extend(true, {}, this.picture)
            this.pictures.containers.push(copiedPicture);
        },
        onImageChange: function (event, ip) {
            var files = event.target.files || event.dataTransfer.files;
            if (!files.length)
                return;

            var fileTypes = ['jpg', 'jpeg', 'png'];
            var extension = files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
                isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

            if (isSuccess) {
                this.readFile(files[0], ip);
            }
            else {
                alert('It is not a picture. Please, use a picture')
            }
            event.preventDefault()
        },
        readFile: function (file, ip) {
            var self = this;
            var reader = new FileReader();
            reader.onloadend = function () {
                self.pictures.containers[ip].base64Picture = reader.result;
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        },
        onImageChangeOrig: function (event) {
            var files = event.target.files || event.dataTransfer.files;
            if (!files.length)
                return;

            var fileTypes = ['jpg', 'jpeg', 'png'];
            var extension = files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
                isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

            if (isSuccess) {
                this.readFileOrig(files[0]);
            }
            else {
                alert('It is not a picture. Please, use a picture')
            }
            event.preventDefault()
        },
        readFileOrig: function (file) {
            var self = this;
            var reader = new FileReader();
            reader.onloadend = function () {
                self.pictures.original = reader.result;
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        },
        sendOnSever: function (event) {
            event.preventDefault()
            var self = this;
            if(this.loading == false) {
                this.loading = true;
                this.$http.post(this.analyseUrl,
                    {
                        'pictures': this.pictures
                    })
                    .then(function(response) {
                        // debugger;
                        if(response.body.data) {
                            this.copyPicture();
                            this.pictures.containers[0].base64Picture = response.body.data;
                        }
                        this.loading = false;
                    }, function (response) {
                        this.$set(this, 'errors', response.body);
                        alert("Errors in form");
                        this.loading = false;
                    });
            }
        }
    }
})