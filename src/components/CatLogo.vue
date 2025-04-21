<template>
	<div>
		<div id="frame" class="cat">
			<div class="center">
				<div class="ear a"></div>
				<div class="ear b"></div>
				<div class="wing a"></div>
				<div class="wing b"></div>
				<div class="tail"></div>
				<div class="body"></div>
				<div class="fang a"></div>
				<div class="fang b"></div>
				<div class="head"></div>
				<div class="extra"></div>
				<div class="eye a"></div>
				<div class="eye b"></div>
				<div class="nose"></div>
			</div>
		</div>
		<h2 class="margin-title text-logo">Fin Cat</h2>
		<p class="text-subtitle-2 text-logo">Gestor de gastos pessoais</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			hover: false,
		};
	},
	methods: {
		toggleHover(state) {
			this.hover = state;
		},
	},
};
</script>

<style scoped>
.margin-title {
	margin-top: 150px;
}
.text-logo {
	color: #4d4c4c;
}
#frame {
	cursor: pointer;
	box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
	border-radius: 50%;
	overflow: hidden;
	transition: background 1s ease-in-out;
	z-index: 1;
	position: absolute;
	width: 170px;
	height: 170px;
	top: 4px;
	left: 50%;
	transform: translateX(-50%);
	background: #70707085;
}

#frame::before {
	position: absolute;
	content: "";
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: #d1913c; /* fallback for old browsers */
	background: -webkit-linear-gradient(
		to right,
		#ffd194,
		#d1913c
	); /* Chrome 10-25, Safari 5.1-6 */
	background: linear-gradient(
		to right,
		#ffd194,
		#d1913c
	); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	z-index: -1;
	transition: opacity 0.5s linear;
	opacity: 0;
}

#frame *,
#frame *:before,
#frame *:after {
	position: absolute;
	transition: all 1s ease-in-out;
}

.center {
	top: 63%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100px;
	height: 100px;
}

.cat .head {
	top: 0px;
	left: 0px;
	width: 100px;
	height: 80px;
	background: #fff;
	border-radius: 50% 50% 50% 50% / 55% 55% 45% 45%;
}

.cat .ear {
	top: 5px;
	left: 12.5px;
	width: 25px;
	height: 25px;
	background: #ffb7bc;
	border-radius: 5px;
	box-shadow: 0 0 0 10px #fff;
	transform: skew(15deg) rotate(20deg);
}

.cat .ear.b {
	transform: skew(-15deg) rotate(-20deg);
	left: 62.5px;
}

.cat .body {
	border-radius: 50% 50% 50% 50% / 80% 80% 20% 20%;
	background: #ffa60b;
	top: 45px;
	left: 10px;
	width: 80px;
	height: 70px;
}

.cat .eye {
	top: 35px;
	left: 20px;
	width: 15px;
	height: 15px;
	background: #aa8c8c;
	border-radius: 9in;
	animation: blink 5s infinite ease-in-out;
}

.cat .eye.b {
	left: 65px;
}

.cat .eye:after {
	width: 10px;
	height: 10px;
}

.cat .nose {
	left: 45px;
	top: 45px;
	background: #fdab9f;
	width: 10px;
	height: 5px;
	border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%;
}

.cat .tail {
	width: 60px;
	height: 60px;
	top: 35px;
	left: 45px;
	border: solid 10px #fff;
	border-color: #efefef transparent transparent #efefef;
	border-radius: 50%/60px 50px 0 0; /* aqui */
	rotate: 140deg;
}

.cat .wing {
	border-radius: 100%;
	width: 5px;
	height: 5px;
	top: 15px;
	left: 45px;
	background: #fff;
}

@keyframes blink {
	0% {
		transform: scaleY(100%);
	}
	3% {
		transform: scaleY(0);
	}
	6% {
		transform: scaleY(100%);
	}
}
</style>
