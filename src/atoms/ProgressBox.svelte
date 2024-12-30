<script>
    export let title = ''
    export let description = ''
</script>

<div class="w-full sm:w-[500px] p-2">
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{title}</h5>
      <p class="card-text">{description}</p>
      <slot></slot>
    </div>
  </div>
</div>
