<template>
	<div class="tool">
		<div class="content">
			<div class="top">
				<div class="tool_img">
					<img src="../assets/image/tool/tool_img.png" alt="">
				</div>
				<div class="tool_right">
					<div class="tool_title">
						<img src="../assets/image/tool/tool_title.png" alt="">
					</div>
					<div class="tool_text">让直播嗨起来</div>
					<div class="tool_btn"><a href="https://obsproject.com/download" target="_blank"><img src="../assets/image/tool/tool_btn.png" alt=""></a></div>
				</div>
			</div>
			<div class="bottom">
				<div>
					<h2>边录边播</h2>
					<div>PC端直播时可开启<br />同步录制，妥妥的</div>
				</div>
				<div>
					<h2>辅助插件</h2>
					<div>弹幕助手、房管助手、<br />互动助手、歌词插件</div>
				</div>
				<div>
					<h2>影音媒体</h2>
					<div>自由添加文字，图片、<br />视频</div>
				</div>
				<div>
					<h2>边录边播</h2>
					<div>自定义多场景，随意<br />切换意随心动</div>
				</div>
			</div>
		</div>
	</div>	
</template>

<script>
	export default {
		name: 'Tool'
	}
</script>

<style lang="scss" scoped>
.tool {
	width: 100%;
	flex: 1;
	background: #f2f5f6;
	color: #333;
	.content {
		margin: 90px auto 27px;
    width: 1320px;
		height: 100%;
		overflow: hidden;

		.top {
			display: flex;

			.tool_img {
				width: 423px;
				margin-left: 6%;
				margin-right: 9%;
				img {
					width: 100%;
				}
			}

			.tool_right {
				.tool_text {
					font-size: 34px;
					padding: 42px 0 97px;
				}

				.tool_btn {
					margin-left: -10px;
				}
			}
		}

		.bottom {
			display: flex;
			margin-left: 50px;

			&>div {
				width: 260px;
				margin-top: 100px;
				padding: 0px 20px;

				h2 {
					font-size: 36px;
				}

				div {
					font-size: 24px;
					margin-top: 34px;
				}
			}
		}
	}
}
@media screen and (max-width: 1500px) {
  .tool {
    .content {
      width: 1120px;
			.top {
				.tool_img {
					width: 359px;
				}
				.tool_title img{
					width: 511px;
				}
				.tool_right {
					.tool_text {
						font-size: 32px;
						padding: 33px 0 81px;
					}
					.tool_btn img {
						width: 318px;
					}
				}				
			}
			.bottom {
				&>div {

					h2 {
						font-size: 34px;
					}

					div {
						font-size: 22px;
						margin-top: 34px;
					}
				}
			}
    }
  }
}
</style>
