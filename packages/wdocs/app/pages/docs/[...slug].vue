<template>
	<div v-if="_isLoading">Loading...</div>
	<div v-else-if="_hasError">Error loading page.</div>
	<ContentProse v-if="_pageData">
		<h1>{{ _pageData.frontmatter?.title }}</h1>
		<template
			v-if="_frontmatter?.api && _frontmatter.method && _frontmatter.path"
		>
			<ApiEndpoint
				:method="_frontmatter.method"
				:path="_frontmatter.path"
				:description="_frontmatter.description"
			/>
			<ApiParameters
				v-if="_frontmatter.parameters"
				:parameters="_frontmatter.parameters"
			/>
			<ApiResponses
				v-if="_frontmatter.responses"
				:responses="_frontmatter.responses"
			/>
		</template>
		<div v-else v-html="_pageData.html"></div>
		<PrevNext />
		<PageFooter :page="_pageData" />
	</ContentProse>
	<div v-else>Page not found.</div>

	<template #aside>
		<ApiTester
			v-if="_frontmatter?.api && _frontmatter.method && _frontmatter.path"
			:method="_frontmatter.method"
			:path="_frontmatter.path"
			:parameters="_frontmatter.parameters"
		/>
		<TableOfContents v-else />
	</template>
</template>

<script setup lang="ts">
const {
	pageData: _pageData,
	isLoading: _isLoading,
	hasError: _hasError,
	frontmatter: _frontmatter,
} = useDocsPageFacade();
</script>
