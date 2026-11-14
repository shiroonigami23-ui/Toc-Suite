# Toc-Suite as a self-hosted static site:  docker run -p 8080:80 ghcr.io/shiroonigami23-ui/toc-suite
# Build context is the staged site (node tools/stage-web.mjs site), see .github/workflows/release.yml.
FROM nginx:1.27-alpine
LABEL org.opencontainers.image.title="Toc-Suite" \
      org.opencontainers.image.description="The Theory of Computation workbench (DFA/NFA, Mealy/Moore, PDA, TM, grammars) as a static web app" \
      org.opencontainers.image.source="https://github.com/shiroonigami23-ui/Toc-Suite" \
      org.opencontainers.image.licenses="MIT"
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY site/ /usr/share/nginx/html/
EXPOSE 80
