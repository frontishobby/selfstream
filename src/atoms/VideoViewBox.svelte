<script>
    export let filename
</script>

<div class="w-full">
    <video class="w-full" preload="metadata" controls>
        <source src="/video/{filename}" type="video/mp4">
        <track kind="captions">
        Your browser does not support the video tag.
    </video>    
</div>
