<svelte:head>
  <title>fr</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<script lang="ts">
  import ShimmerButton from '$lib/ShimmerButton.svelte';
  import { resolve } from '$app/paths';
  let name = $state('');
  let email = $state('');

  function submitForm() {
    if (name && email) {
      window.location.href = resolve(
        `/rsvp?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
      );
    }
  }

  const top = [
    {
      d: 'M 580 165 C 830 110, 1130 70, 1460 58',
      color: '#D9A12D',
      width: 22,
      delay: '0s'
    },
    {
      d: 'M 560 255 C 820 215, 1130 165, 1460 118',
      color: '#EB4747',
      width: 24,
      delay: '0.12s'
    }
  ];

  const bottom = [
    {
      d: 'M -130 560 C 90 610, 300 655, 585 690',
      color: '#4C93DF',
      width: 24,
      delay: '0.18s'
    },
    {
      d: 'M -150 650 C 90 730, 320 790, 690 850',
      color: '#61DE3F',
      width: 24,
      delay: '0.3s'
    }
  ];

  const faqItems = [
    {
      question: 'who is eligible?',
      answer:
        'to be eligible for fr, you need to be between the ages for 13 and 18.'
    },
    {
      question: 'how much does it cost?',
      answer:
        "it's 100% free! if you qualify, we'll pay for all your prizes + shipping (except customs fees)!"
    },
    {
      question: 'what counts as "collaberative?"',
      answer:
        "your app should be collaborative! it should include one collaberative/multiplayer component. this could be anything from a shared drawing board to a multiplayer game!"
    },
    {
      question: 'what can i make?',
      answer:
        "all types of projects are allowed! whether it's a game, an app, or a website, as long as it has  one collaberative/multiplayer component, it qualifies!"
    }
  ];
</script>

<div class="page">
  <svg class="bg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter id="roughen">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="1"
          seed="8"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" />
      </filter>
    </defs>

    {#each top as line (line.d)}
      <path
        class="stroke draw"
        d={line.d}
        stroke={line.color}
        stroke-width={line.width}
        style={`animation-delay:${line.delay};`}
      />
    {/each}

    {#each bottom as line (line.d)}
      <path
        class="stroke draw"
        d={line.d}
        stroke={line.color}
        stroke-width={line.width}
        style={`animation-delay:${line.delay};`}
      />
    {/each}
  </svg>

  <div class="cursor cursor-top" aria-hidden="true" style="offset-path: path('{top[0].d}'); offset-rotate: auto; animation: moveAlongPathReverse 1.2s cubic-bezier(0.22, 1, 0.36, 1) {top[0].delay} forwards;">
    <svg width="250" height="254" viewBox="0 0 250 254" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M224.647 138.313L84.0315 49.8311C76.7707 45.2624 67.5359 51.4914 68.9343 60.0143L96.0131 225.078C97.4529 233.854 108.674 236.502 113.868 229.291L152.333 175.883C153.73 173.943 155.767 172.569 158.076 172.009L221.662 156.583C230.248 154.5 232.124 143.018 224.647 138.313Z" fill="black"/>
<path d="M224.647 138.313L84.0315 49.8311C76.7707 45.2624 67.5359 51.4914 68.9343 60.0143L96.0131 225.078C97.4529 233.854 108.674 236.502 113.868 229.291L152.333 175.883C153.73 173.943 155.767 172.569 158.076 172.009L221.662 156.583C230.248 154.5 232.124 143.018 224.647 138.313Z" stroke="#FF9292" stroke-width="30"/>
<path d="M227.306 134.085L86.6895 45.6035C75.683 38.6775 61.9306 48.1717 64.0057 60.8212L91.0846 225.885C93.2429 239.041 110.124 243.038 117.921 232.211L156.385 178.803C157.09 177.824 158.111 177.141 159.255 176.863L222.841 161.437C235.708 158.316 238.528 141.147 227.306 134.085Z" stroke="#FF9292" stroke-width="30"/>
</svg>
  </div>

  <div class="cursor cursor-bottom" aria-hidden="true" style="offset-path: path('{bottom[0].d}'); offset-rotate: auto; animation: moveAlongPath 1.2s cubic-bezier(0.22, 1, 0.36, 1) {bottom[0].delay} forwards;">
    <svg width="198" height="213" viewBox="0 0 198 213" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M176.158 177.869L109.06 25.8827C105.596 18.0348 94.4566 18.0349 90.8499 25.8827L20.9969 177.869C17.2827 185.95 25.1054 194.42 33.4437 191.346L95.1974 168.578C97.4405 167.751 99.8977 167.751 102.125 168.578L163.466 191.346C171.749 194.42 179.725 185.95 176.158 177.869Z" fill="black"/>
<path d="M176.158 177.869L109.06 25.8827C105.596 18.0348 94.4566 18.0349 90.8499 25.8827L20.9969 177.869C17.2827 185.95 25.1054 194.42 33.4437 191.346L95.1974 168.578C97.4405 167.751 99.8977 167.751 102.125 168.578L163.466 191.346C171.749 194.42 179.725 185.95 176.158 177.869Z" stroke="#FFEBC2" stroke-width="30"/>
<path d="M180.726 175.85L113.628 23.8642C108.376 11.9674 91.6659 12.1483 86.3128 23.7956L16.4598 175.782C10.8924 187.895 22.652 200.649 35.1707 196.034L96.9244 173.265C98.0561 172.848 99.2847 172.852 100.388 173.262L161.729 196.03C174.143 200.637 186.081 187.98 180.726 175.85Z" stroke="#FFEBC2" stroke-width="30"/>
</svg>
  </div>

  <section class="hero">
    <h1>fr</h1>
    <p>build software people use together</p>
    <form onsubmit={(event) => {
      event.preventDefault();
      submitForm();
    }} class="rsvp-form" style="border: 2px solid black; border-radius: 1rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; max-width: 350px; margin: 2.5rem auto 2.5rem auto; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <input type="text" placeholder="Name" bind:value={name} required class="input" style="border: 1.5px solid black; border-radius: 0.5rem; padding: 0.75rem; font-size: 1rem;" />
      <input type="email" placeholder="Email" bind:value={email} required class="input" style="border: 1.5px solid black; border-radius: 0.5rem; padding: 0.75rem; font-size: 1rem;" />
      <ShimmerButton type="submit" class="rsvp-button shadow-2xl">
        <span class="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap text-white lg:text-lg dark:from-white dark:to-slate-900/10">
          RSVP
        </span>
      </ShimmerButton>
    </form>
  </section>

  <div class="arrow-container" aria-hidden="true">
    <p class="text-black">Scroll down for more information</p>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Arrow-down.svg"
      alt="Arrow down"
      class="arrow-down"
    />
  </div>
</div>

<section class="faq">
  <div class="faq-header">
    <h2>faq</h2>
  </div>

  <div class="faq-grid">
    {#each faqItems as item (item.question)}
      <article class="faq-card">
        <h3>{item.question}</h3>
        <p>{item.answer}</p>
      </article>
    {/each}

    <article class="faq-card faq-card-wide">
      <h3>is this legit? what's hack club?</h3>
      <p>
        we're legit! hack club is the world's largest community of teenage makers, and a
        501(c)(3) nonprofit. we've hosted programs like <a href="https://highseas.hackclub.com/">high seas</a>
        and <a href="https://summer.hackclub.com/">summer of making</a> which gave out prizes for
        building other sorts of projects. we're supported by donations from companies like GitHub
        or individual generous donations!
      </p>
    </article>
  </div>
</section>
