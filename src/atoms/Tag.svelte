<script>
    export let tag = ''
</script>

<button type="button" class="btn btn-secondary btn-sm" onclick={() => location.href=`/?tag=${tag}`}>{tag}</button>