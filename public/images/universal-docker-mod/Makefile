SOURCES := $(wildcard *.mmd)
OBJECTS := $(patsubst %.mmd, %.svg, $(SOURCES))

%.svg: %.mmd
	npx -p @mermaid-js/mermaid-cli mmdc -i $^ -o $@

all: $(OBJECTS)
