<script>
    import logo from "~@static/images/browser-action.png";
    import Navbar from "@kwangure/strawberry/components/Navbar";
    import Theme from "@kwangure/strawberry/components/Theme";
</script>

<Theme/>

<div class="layout">
    <Navbar href="#!/">
        <svelte:fragment slot="logo">
            <img src={logo} alt="Lisa's logo"/>
        </svelte:fragment>
    </Navbar>
    <main>
        <slot></slot>
    </main>
</div>

<style>
    .layout {
        --page-width: 92%;
        height: 100%;
        font-family: 'Inter', var(--br-font-family);
        display: grid;
        grid-template-rows: max-content 1fr;
    }
    .layout :global(.berry-navbar.berry-navbar) {
        --br-nav-max-width: 57rem;
        --br-nav-width: var(--page-width);
        --br-nav-height: 72px;
        --br-nav-block-padding: 0px;
    }
    main {
        max-width: 56rem;
        width: var(--page-width);
        margin-left: auto;
        margin-right: auto;
    }
    img {
        display: block;
        height: 50px;
		padding: var(--br-outer-gutter);
	}
    main {
        padding: var(--br-outer-gutter);
    }
</style>
