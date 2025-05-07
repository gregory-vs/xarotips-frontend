import React, { useState } from "react";
import { Drawer, Form, Input, Select, Space, Button } from "antd";
import { Team } from "../types/Team";
import { getPlayersByTeam } from "../services/playerService";
const { Option } = Select;

interface Props {
  openDrawer: boolean;
  teamList: Team[];
}

const NewBetDrawer: React.FC<Props> = (props: Props) => {
  const [playerList, setPlayerList] = useState<any>([])
  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onTeamChange = async (value: number) => {
    const playerListResponse = await getPlayersByTeam(value);
    setPlayerList(playerListResponse)
  };

  return (
    <Drawer title="Nova Bet" open={props.openDrawer} size={"large"}>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="team" label="Selecione o Time" rules={[{ required: true }]}>
          <Select
            placeholder="Selecione o time"
            onChange={onTeamChange}
            options={props.teamList}
          >
          </Select>
        </Form.Item>
        <Form.Item name="player" label="Selecione o jogador" rules={[{ required: true }]}>
          <Select
            placeholder="Selecione o jogador"
            onChange={onTeamChange}
            options={playerList}
          >
          </Select>
        </Form.Item>
        <Form.Item name="value" label="Qual a pontuação?" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>

          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default NewBetDrawer;
