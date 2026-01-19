UUID := tegelzetter@palmersec.com
EXTDIR := $(HOME)/.local/share/gnome-shell/extensions/$(UUID)

.PHONY: install uninstall enable disable reload logs

install:
	mkdir -p "$(EXTDIR)"
	rsync -a --delete \
		--exclude ".git" \
		--exclude "node_modules" \
		--exclude "*.swp" \
		./ "$(EXTDIR)/"
	glib-compile-schemas "$(EXTDIR)/schemas"

uninstall:
	rm -rf "$(EXTDIR)"

enable:
	gnome-extensions enable "$(UUID)"

disable:
	gnome-extensions disable "$(UUID)"

reload: disable enable

logs:
	journalctl --user -f -o cat /usr/bin/gnome-shell

