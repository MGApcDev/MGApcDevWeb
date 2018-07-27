<p class="post--image">
{% if include.url contains '://'  %}
<img src="{{ include.url }}" alt="">
{% else %}
<img src="{{ "/assets/posts/" | append: include.url | relative_url }}" alt="">
{% endif %}
</p>
{% if include.desc and include.desc != '' %}
<p class="post--image-desc"><i>{{ include.desc }}</i></p>
{% endif %}
