<script lang="ts">
    import Tag from "../atoms/Tag.svelte";

    export let tags: string[] = []
</script>

<div class="flex flex-wrap gap-2 p-2">
    {#each tags as tag}
        <Tag {tag} />
    {/each}
</div>