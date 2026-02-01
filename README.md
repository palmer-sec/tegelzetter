# tegelzetter
#### Hotkey-Based Window Tiling for GNOME with Wayland

## Installation

#### Clone this repository

```bash
git clone https://github.com/palmer-sec/tegelzetter && cd tegelzetter
```

#### Make

```bash
make install
make reload
```

## Usage

The goal of this project is to create an environment that can offer an efficient workflow by providing 
key bindings that will be useful on ultrawide monitors.
With only a few key bindings, windows can be tiled quickly into configurations like the example below:
                                                                                
![Fig. 3: Example screen arrangement](images/tegelzetter_example.png)

### Key Bindings

Key bindings are assigned to physically reflect the position on the screen being targeted to make
it easier to remember. Starting from the top left of your keyboard, the first four keys are
Q, W, E, and R. These keys are mapped to the top 4 positions at 50% screen height and 25% screen width.
A, S, D, and F are mapped to the bottom four positions and H, J, K, and L are mapped to the 4 positions at
100% height and 25% width. See the table below.

| Binding | Result |
| :---    | :---   |
| `[ctrl]+[super]+q` | ![Q](images/tegelzetter_q.png) |
| `[ctrl]+[super]+w` | ![W](images/tegelzetter_w.png) |
| `[ctrl]+[super]+e` | ![E](images/tegelzetter_e.png) |
| `[ctrl]+[super]+r` | ![R](images/tegelzetter_r.png) |
| `[ctrl]+[super]+a` | ![A](images/tegelzetter_a.png) |
| `[ctrl]+[super]+s` | ![S](images/tegelzetter_s.png) |
| `[ctrl]+[super]+d` | ![D](images/tegelzetter_d.png) |
| `[ctrl]+[super]+f` | ![F](images/tegelzetter_f.png) |
| `[ctrl]+[super]+h` | ![H](images/tegelzetter_h.png) |
| `[ctrl]+[super]+j` | ![J](images/tegelzetter_j.png) |
| `[ctrl]+[super]+k` | ![K](images/tegelzetter_k.png) |
| `[ctrl]+[super]+l` | ![L](images/tegelzetter_l.png) |
Fig 4: Key binding table

## Future Improvements & Additions

+ Add additional tiling geometry, including 50% vertically & horizontally
+ Add a 'settings' or 'config' gui to customize keyboard shortcuts
+ Solve the issue regarding window positioning after sleep or screen lock
+ Solve the issue regarding GNOME's default tiling interrupting tegelzetter and requiring a `[super]+down` press to escape GNOME's default tiling mode. 
+ introducing a 'screen move' mode that allows windows to be individually resized with hotkeys. 
